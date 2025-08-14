// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// --- Model Imports ---
const categorySchema = require('../models/category')
const questionSchema = require('../models/questions');
const optionsSchema = require('../models/options');
const optionScoreSchema = require('../models/scores');


// --- Reusable Service Functions ---
const upsertScoresForOption = async (optionId, scoresData, session = null) => {
    if (!scoresData || !Array.isArray(scoresData)) {
        throw new Error("scoresData must be an array.");
    }

    const scorePromises = scoresData.map(async (scoreInfo) => {
        const category = await categorySchema.findOne({ code: scoreInfo.code.toUpperCase() }).session(session).lean();
        if (!category) {
            throw new Error(`Category with code "${scoreInfo.code}" not found.`);
        }

        // Find a score document by optionId and categoryId, and update it.
        // The `upsert: true` option creates a new document if one doesn't exist.
        return optionScoreSchema.findOneAndUpdate(
            { optionId: optionId, categoryId: category._id },
            { $set: { score: scoreInfo.score } },
            { new: true, upsert: true, session: session }
        );
    });

    await Promise.all(scorePromises);
};

const addOptionsForQuestion = async (questionId, optionsData, session = null) => {
    if (!optionsData || !Array.isArray(optionsData)) {
        throw new Error("optionsData must be an array.");
    }

    const optionPromises = optionsData.map(async (opt) => {
        if (!opt.text || !opt.scores || !opt.suggestion || !opt.suggestion_category) {
            throw new Error("Invalid option data. Each option must have 'text' , 'suggestion', 'suggestion_category'  and a 'scores' array.");
        }

        const newOption = new optionsSchema({ questionId, text: opt.text , suggestion: opt.suggestion , suggestion_category: opt.suggestion_category });
        const savedOption = await newOption.save({ session });

        // Use the upsert function to add the scores for the new option.
        await upsertScoresForOption(savedOption._id, opt.scores, session);
        return savedOption;
    });

    return Promise.all(optionPromises);
};


// --- API Routes ---
router.get('/questions', async (req, res) => {
    try {
        const questions = await questionSchema.aggregate([
            // Stage 2: For each question, perform a lookup to find its options
            {
                $lookup: {
                    from: "optionsschemas", // The collection name for the options model
                    let: { question_id: "$_id" },
                    pipeline: [
                        // Find all options that match the question's ID
                        { $match: { $expr: { $eq: ["$questionId", "$$question_id"] } } },
                        // For each matching option, perform another lookup to find its scores
                        {
                            $lookup: {
                                from: "optionscoreschemas", // The collection name for the scores model
                                let: { option_id: "$_id" },
                                pipeline: [
                                    // Find all scores that match the option's ID
                                    { $match: { $expr: { $eq: ["$optionId", "$$option_id"] } } },
                                    // For each score, lookup its category details
                                    {
                                        $lookup: {
                                            from: "categoryschemas", // The collection name for the categories model
                                            localField: "categoryId",
                                            foreignField: "_id",
                                            as: "category"
                                        }
                                    },
                                    // Deconstruct the category array to get a single object
                                    { $unwind: "$category" },
                                    // Reshape the output for the score
                                    {
                                        $project: {
                                            _id: 0, // Exclude the score's original _id
                                            score: 1,
                                            code: "$category.code",
                                            categoryName: "$category.name"
                                        }
                                    }
                                ],
                                as: "scores"
                            }
                        },
                        // Reshape the output for the option
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
            }
        ]);

        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Failed to fetch questions.', error: error.message });
    }
});

router.post('/add', async (req, res) => {
    console.log(req.body.options[0].scores);
    const { text, multiChoice, options , category } = req.body;

    if (!text || !options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ message: 'Request body must include text and a non-empty options array.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const question = new questionSchema({ text, multiChoice, category });
        const savedQuestion = await question.save({ session });

        await addOptionsForQuestion(savedQuestion._id, options, session);

        await session.commitTransaction();
        res.status(201).json({ message: 'Question added successfully!', question: savedQuestion });
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction failed:', error);
        res.status(500).json({ message: 'Failed to add question.', error: error.message });
    } finally {
        session.endSession();
    }
});

router.put('/questions/:questionId', async (req, res) => {
    const { questionId } = req.params;
    const { text, multiChoice, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }

    try {
        const updatedQuestion = await questionSchema.findByIdAndUpdate(
            questionId,
            { $set: { text, multiChoice, category } },
            { new: true, runValidators: true } // Return the updated doc and run schema validators
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

router.delete('/question/:questionId', async (req, res) => {
    const { questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const question = await questionSchema.findById(questionId).session(session);
        if (!question) {
            throw new Error('Question not found.');
        }

        // 1. Find all options related to the question
        const options = await optionsSchema.find({ questionId: questionId }).session(session);
        const optionIds = options.map(opt => opt._id);

        // 2. If there are options, delete their scores
        if (optionIds.length > 0) {
            await optionScoreSchema.deleteMany({ optionId: { $in: optionIds } }).session(session);
        }

        // 3. Delete the options themselves
        await optionsSchema.deleteMany({ questionId: questionId }).session(session);

        // 4. Delete the question itself
        await questionSchema.findByIdAndDelete(questionId).session(session);

        await session.commitTransaction();
        res.status(200).json({ message: 'Question and all associated data deleted successfully.' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting question:', error);
        res.status(error.message === 'Question not found.' ? 404 : 500).json({ message: 'Failed to delete question.', error: error.message });
    } finally {
        session.endSession();
    }
});

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
        const question = await questionSchema.findById(questionId).session(session);
        if (!question) {
            throw new Error('Question not found.');
        }

        const newOptions = await addOptionsForQuestion(questionId, optionsData, session);

        await session.commitTransaction();
        res.status(201).json({ message: 'Options added successfully', newOptions });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error adding options:', error);
        res.status(error.message === 'Question not found.' ? 404 : 500).json({ message: 'Failed to add options.', error: error.message });
    } finally {
        session.endSession();
    }
});

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
        const option = await optionsSchema.findById(optionId).session(session);
        if (!option) {
            throw new Error('Option not found.');
        }

        await upsertScoresForOption(optionId, scoresData, session);

        await session.commitTransaction();
        res.status(200).json({ message: 'Scores updated successfully.' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating scores:', error);
        res.status(error.message === 'Option not found.' ? 404 : 500).json({ message: 'Failed to update scores.', error: error.message });
    } finally {
        session.endSession();
    }
});


// --- Export Router ---
module.exports = router;
