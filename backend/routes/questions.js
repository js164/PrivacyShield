// ============================================================================
// QUESTIONS ROUTES - CRUD operations for questions, options, and scores
// File: routes/questions.js
// ============================================================================
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // Admin authentication middleware

// --- Model Imports ---
const categorySchema = require('../models/category');
const questionSchema = require('../models/questions');
const optionsSchema = require('../models/options');
const optionScoreSchema = require('../models/scores');

// --- Reusable Service Functions ---

/**
 * Upserts (insert or update) scores for a given option across multiple categories
 * @param {ObjectId} optionId - The ID of the option to update scores for
 * @param {Array} scoresData - Array of score objects with category codes and score values
 * @param {Session} session - MongoDB session for transaction support
 */
const upsertScoresForOption = async (optionId, scoresData, session = null) => {
    if (!scoresData || !Array.isArray(scoresData)) {
        throw new Error("scoresData must be an array.");
    }

    // Process each score entry
    const scorePromises = scoresData.map(async (scoreInfo) => {
        // Find the category by code to get its ObjectId
        const category = await categorySchema.findOne({
            code: scoreInfo.code.toUpperCase()
        }).session(session).lean();

        if (!category) {
            throw new Error(`Category with code "${scoreInfo.code}" not found.`);
        }

        // Upsert: update existing score or create new one
        return optionScoreSchema.findOneAndUpdate(
            { optionId: optionId, categoryId: category._id },
            { $set: { score: scoreInfo.score } },
            { new: true, upsert: true, session: session }
        );
    });

    await Promise.all(scorePromises);
};

/**
 * Adds multiple options to a question and sets up their scoring
 * @param {ObjectId} questionId - The ID of the question to add options to
 * @param {Array} optionsData - Array of option objects with text, suggestion, and scores
 * @param {Session} session - MongoDB session for transaction support
 */
const addOptionsForQuestion = async (questionId, optionsData, session = null) => {
    if (!optionsData || !Array.isArray(optionsData)) {
        throw new Error("optionsData must be an array.");
    }

    const optionPromises = optionsData.map(async (opt) => {
        // Validate required fields for each option
        if (!opt.text || !opt.scores || !opt.suggestion || !opt.suggestion_category) {
            throw new Error("Invalid option data. Each option must have 'text', 'suggestion', 'suggestion_category', and a 'scores' array.");
        }

        // Create and save the new option
        const newOption = new optionsSchema({
            questionId,
            text: opt.text,
            suggestion: opt.suggestion,
            suggestion_category: opt.suggestion_category
        });
        const savedOption = await newOption.save({ session });

        // Add scores for this option across different categories
        await upsertScoresForOption(savedOption._id, opt.scores, session);
        return savedOption;
    });

    return Promise.all(optionPromises);
};

// --- API Routes ---

/**
 * GET /questions - Retrieve all questions with their options and scoring data
 * Uses MongoDB aggregation pipeline to join questions, options, scores, and categories
 * Also calculates maximum possible scores for each category per question
 */
router.get('/questions', async (req, res) => {
    try {
        const questions = await questionSchema.aggregate([
            // Join with options collection
            {
                $lookup: {
                    from: "optionsschemas", // Collection name for options
                    let: { question_id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$questionId", "$$question_id"] } } },
                        // Join with option scores
                        {
                            $lookup: {
                                from: "optionscoreschemas", // Collection name for scores
                                let: { option_id: "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$optionId", "$$option_id"] } } },
                                    // Join with categories to get category details
                                    {
                                        $lookup: {
                                            from: "categoryschemas",
                                            localField: "categoryId",
                                            foreignField: "_id",
                                            as: "category"
                                        }
                                    },
                                    { $unwind: "$category" },
                                    // Project only needed fields from the score-category join
                                    {
                                        $project: {
                                            _id: 0,
                                            score: 1,
                                            code: "$category.code",
                                            categoryName: "$category.name"
                                        }
                                    }
                                ],
                                as: "scores"
                            }
                        },
                        // Project option fields
                        {
                            $project: {
                                _id: 1,
                                text: 1,
                                scores: 1,
                                suggestion: 1,
                                suggestion_category: 1,
                            }
                        }
                    ],
                    as: "options"
                }
            },
            // Calculate maximum scores per category for this question
            {
                $addFields: {
                    maxScore: {
                        $let: {
                            vars: {
                                // Flatten all scores from all options
                                allScores: {
                                    $reduce: {
                                        input: "$options",
                                        initialValue: [],
                                        in: { $concatArrays: ["$$value", "$$this.scores"] }
                                    }
                                }
                            },
                            in: {
                                $let: {
                                    vars: {
                                        // Get unique category codes
                                        uniqueCodes: {
                                            $reduce: {
                                                input: "$$allScores.code",
                                                initialValue: [],
                                                in: { $setUnion: ["$$value", ["$$this"]] }
                                            }
                                        }
                                    },
                                    in: {
                                        // For each category code, find the maximum score
                                        $map: {
                                            input: "$$uniqueCodes",
                                            as: "currentCode",
                                            in: {
                                                categoryCode: "$$currentCode",
                                                max: {
                                                    $max: {
                                                        $map: {
                                                            input: {
                                                                $filter: {
                                                                    input: "$$allScores",
                                                                    as: "scoreItem",
                                                                    cond: { $eq: ["$$scoreItem.code", "$$currentCode"] }
                                                                }
                                                            },
                                                            as: "filteredScore",
                                                            in: "$$filteredScore.score"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Failed to fetch questions.', error: error.message });
    }
});

/**
 * POST /add - Add a new question with its options and scores
 * Requires admin authentication
 * Uses MongoDB transactions to ensure data consistency
 */
router.post('/add', adminAuth, async (req, res) => {
    const { text, options, category } = req.body;

    // Validate required fields
    if (!text || !options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ message: 'Request body must include text and a non-empty options array.' });
    }

    // Start database transaction to ensure atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create and save the question
        const question = new questionSchema({ text, category });
        const savedQuestion = await question.save({ session });

        // Add all options and their scores
        await addOptionsForQuestion(savedQuestion._id, options, session);

        // Commit transaction if everything succeeded
        await session.commitTransaction();
        res.status(201).json({ message: 'Question added successfully!', question: savedQuestion });
    } catch (error) {
        // Rollback transaction on any error
        await session.abortTransaction();
        console.error('Transaction failed:', error);
        res.status(500).json({ message: 'Failed to add question.', error: error.message });
    } finally {
        // Always end the session
        session.endSession();
    }
});

/**
 * PUT /questions/:questionId - Update question text and category
 * Only updates the question metadata, not the options
 */
router.put('/questions/:questionId', async (req, res) => {
    const { questionId } = req.params;
    const { text, category } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }

    try {
        const updatedQuestion = await questionSchema.findByIdAndUpdate(
            questionId,
            { $set: { text, category } },
            { new: true, runValidators: true } // Return updated doc and run validators
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        res.status(200).json({ message: 'Question updated successfully.', question: updatedQuestion });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Failed to update question.', error: error.message });
    }
});

/**
 * DELETE /question/:questionId - Delete question and all associated data
 * Cascades deletion to options and option scores to maintain referential integrity
 * Uses transactions to ensure all-or-nothing deletion
 */
router.delete('/question/:questionId', async (req, res) => {
    const { questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Verify question exists
        const question = await questionSchema.findById(questionId).session(session);
        if (!question) {
            throw new Error('Question not found.');
        }

        // Find all options related to the question
        const options = await optionsSchema.find({ questionId: questionId }).session(session);
        const optionIds = options.map(opt => opt._id);

        // Delete option scores first (to maintain referential integrity)
        if (optionIds.length > 0) {
            await optionScoreSchema.deleteMany({ optionId: { $in: optionIds } }).session(session);
        }

        // Delete the options
        await optionsSchema.deleteMany({ questionId: questionId }).session(session);

        // Finally, delete the question itself
        await questionSchema.findByIdAndDelete(questionId).session(session);

        await session.commitTransaction();
        res.status(200).json({ message: 'Question and all associated data deleted successfully.' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting question:', error);
        res.status(error.message === 'Question not found.' ? 404 : 500).json({
            message: 'Failed to delete question.',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

/**
 * POST /questions/:questionId/options - Add new options to existing question
 * Useful for extending questions after creation
 */
router.post('/questions/:questionId/options', async (req, res) => {
    const { questionId } = req.params;
    const optionsData = req.body; // Expects an array of option objects

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }
    if (!Array.isArray(optionsData) || optionsData.length === 0) {
        return res.status(400).json({ message: 'Request body must be a non-empty array of options.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Verify question exists
        const question = await questionSchema.findById(questionId).session(session);
        if (!question) {
            throw new Error('Question not found.');
        }

        // Add the new options
        const newOptions = await addOptionsForQuestion(questionId, optionsData, session);

        await session.commitTransaction();
        res.status(201).json({ message: 'Options added successfully', newOptions });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error adding options:', error);
        res.status(error.message === 'Question not found.' ? 404 : 500).json({
            message: 'Failed to add options.',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

/**
 * PUT /options/:optionId/scores - Update scores for a specific option
 * Allows modification of how an option contributes to different category scores
 */
router.put('/options/:optionId/scores', async (req, res) => {
    const { optionId } = req.params;
    const scoresData = req.body; // Expects an array of score objects

    if (!mongoose.Types.ObjectId.isValid(optionId)) {
        return res.status(400).json({ message: 'Invalid option ID format.' });
    }
    if (!Array.isArray(scoresData) || scoresData.length === 0) {
        return res.status(400).json({ message: 'Request body must be a non-empty array of scores to update.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Verify option exists
        const option = await optionsSchema.findById(optionId).session(session);
        if (!option) {
            throw new Error('Option not found.');
        }

        // Update the scores
        await upsertScoresForOption(optionId, scoresData, session);

        await session.commitTransaction();
        res.status(200).json({ message: 'Scores updated successfully.' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating scores:', error);
        res.status(error.message === 'Option not found.' ? 404 : 500).json({
            message: 'Failed to update scores.',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

/**
 * POST /add-multiple - Bulk add multiple questions with their options
 * Efficient way to populate the database with multiple questions at once
 * All operations are wrapped in a single transaction
 */
router.post('/add-multiple', async (req, res) => {
    const questionsArray = req.body.questions;

    if (!questionsArray || !Array.isArray(questionsArray) || questionsArray.length === 0) {
        return res.status(400).json({ message: 'Request body must include a non-empty "questions" array.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const insertedQuestions = [];

        // Process each question in the array
        for (const questionData of questionsArray) {
            const { text, multiChoice, category, options } = questionData;

            // Validate each question's structure
            if (!text || !options || !Array.isArray(options) || options.length === 0) {
                throw new Error(`Invalid question data: ${JSON.stringify(questionData)}`);
            }

            // Insert the question
            const question = new questionSchema({ text, multiChoice, category });
            const savedQuestion = await question.save({ session });

            // Insert its options and scores
            await addOptionsForQuestion(savedQuestion._id, options, session);

            insertedQuestions.push(savedQuestion);
        }

        await session.commitTransaction();
        res.status(201).json({
            message: `${insertedQuestions.length} questions added successfully!`,
            questions: insertedQuestions
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Bulk transaction failed:', error);
        res.status(500).json({ message: 'Failed to add questions.', error: error.message });
    } finally {
        session.endSession();
    }
});

// --- Export Router ---
module.exports = router;