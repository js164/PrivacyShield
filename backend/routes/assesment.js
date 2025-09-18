// ============================================================================
// ASSESSMENT ROUTES - Main assessment logic and scoring
// File: routes/assessment.js
// ============================================================================
const express = require('express');
const category = require('../models/category');
const Misconception = require('../models/misconceptions');
const sendEmail = require('../mailer');
const schedule = require("node-schedule");
const emailTemplate = require('../EmailTemplate');
const emailInitialTemplate = require('../EmailInitialTemplate');
const route = express.Router();

/**
 * Category mapping for scoring calculation
 * Maps high-level category names to arrays of concern codes used in scoring
 * This determines which concern codes contribute to each category's overall score
 */
const categoryMappingForScoring = {
    "Digital Identity & Authentication": ["DIT", "SB", "DC", "MPOT", "SE", "CE", "MIC", "PD"],
    "Data Collection & Control": ["DC", "UDU", "GLR", "PD", "ODU", "PA", "DSTP", "LT", "DR", "MPOT", "CD", "LRPG"],
    "Location & Physical Safety": ["GLR", "PD", "ST", "APS", "DC"],
    "Social & Reputation Management": ["ESH", "RD", "LC", "APS", "MPOT", "CD"],
    "Surveillance & Tracking": ["ST", "UDU", "DSTP", "LT", "MPOT"],
    "Transparency & Corporate Trust": ["ODU", "LT", "PA", "LRPG", "MIC", "DSTP"],
    "Legal & Advanced Privacy": ["LRPG", "MPOT", "CD", "DR", "APS", "CE", "ESH", "RD"]
};

/**
 * Category mapping for suggestion generation
 * Maps high-level category names to arrays of concern codes used for generating suggestions
 * Subset of scoring codes - only the most relevant ones for actionable suggestions
 */
const suggestionMapping = {
    "Digital Identity & Authentication": ["DIT", "SB", "SE"],
    "Data Collection & Control": ["DC", "UDU", "PA", "DR"],
    "Location & Physical Safety": ["GLR", "PD", "APS"],
    "Social & Reputation Management": ["ESH", "RD", "LC"],
    "Surveillance & Tracking": ["ST", "DSTP", "LT"],
    "Transparency & Corporate Trust": ["ODU", "MIC", "LRPG"],
    "Legal & Advanced Privacy": ["MPOT", "CE", "CD"]
};

/**
 * Fetches all category suggestions from the database
 * Transforms the data into a lookup object keyed by category code
 * @returns {Object} Object with category codes as keys and suggestion data as values
 */
const fetchSuggestions = async () => {
    try {
        const suggestionsArray = await category.find({});

        // Transform array into lookup object for faster access
        return suggestionsArray.reduce((acc, suggestion) => {
            acc[suggestion.code] = {
                positive: suggestion.positive_suggestion,
                // negative: suggestion.negative_suggestion, // Currently not used
                tools: suggestion.tools,
                methodology: suggestion.methodology
            };
            return acc;
        }, {});
    } catch (error) {
        console.error("Error fetching suggestions from DB:", error);
        return {}; // Return empty object on error to prevent crashes
    }
};

/**
 * Fetches misconception data from the database
 * Organizes misconceptions by category name for easy lookup
 * @returns {Object} Object with category names as keys and misconception arrays as values
 */
async function fetchMisconceptions() {
    try {
        const misconceptionDocs = await Misconception.find({});
        const formattedData = {};

        // Organize misconceptions by category name
        for (const doc of misconceptionDocs) {
            formattedData[doc.categoryName] = doc.misconceptions;
        }
        return formattedData;
    } catch (error) {
        console.error("Error fetching misconception data:", error);
        return {}; // Return empty object on failure to prevent crashes
    }
}

/**
 * POST /report - Generate assessment report based on user scores
 * Takes user scores and maximum possible scores, calculates category percentages,
 * generates appropriate suggestions, and includes relevant misconceptions
 */
route.post('/report', async function (req, res, next) {
    // Fetch both suggestions and misconceptions data in parallel for efficiency
    const [suggestionsDB, misconceptionsDB] = await Promise.all([
        fetchSuggestions(),
        fetchMisconceptions()
    ]);

    // Validate that essential data was loaded successfully
    if (Object.keys(suggestionsDB).length === 0) {
        return res.status(500).json({ error: "Could not load suggestion data from the database." });
    }
    if (Object.keys(misconceptionsDB).length === 0) {
        return res.status(500).json({ error: "Could not load misconception data from the database." });
    }

    const { scores, maxScores } = req.body;

    // Validate required request body structure
    if (!scores || !maxScores || Object.keys(scores).length === 0) {
        return res.status(400).json({ error: "Request body must contain 'scores' and 'maxScores' objects." });
    }

    // Validate that all provided concern codes are valid
    const allConcernCodes = new Set(Object.values(categoryMappingForScoring).flat());
    for (const key in scores) {
        if (!allConcernCodes.has(key)) {
            return res.status(400).json({ error: `Invalid concern code provided in scores: '${key}'` });
        }
        if (maxScores[key] === undefined) {
            return res.status(400).json({ error: `Missing max score for concern code: '${key}'` });
        }
    }

    const report = {};

    // Process each category to generate comprehensive report
    for (const categoryName in categoryMappingForScoring) {
        const concernsForScoring = categoryMappingForScoring[categoryName];
        let categoryTotalPoints = 0;
        let maxPossiblePointsForCategory = 0;

        // Calculate total scores for this category
        for (const concernCode of concernsForScoring) {
            categoryTotalPoints += scores[concernCode] || 0;
            maxPossiblePointsForCategory += maxScores[concernCode] || 0;
        }

        // Calculate percentage score (inverted: higher percentage = better privacy)
        // Formula: ((max - actual) / max) * 100 = percentage of privacy maintained
        const scorePercentage = maxPossiblePointsForCategory > 0
            ? Math.round(((maxPossiblePointsForCategory - categoryTotalPoints) / maxPossiblePointsForCategory) * 100)
            : 0;

        // Generate suggestions based on user's performance in specific concerns
        const categorySuggestions = [];
        const concernsForSuggestions = suggestionMapping[categoryName] || [];

        for (const concernCode of concernsForSuggestions) {
            const userScore = scores[concernCode] || 0;
            const maxScore = maxScores[concernCode] || 0;

            if (suggestionsDB[concernCode] && maxScore > 0) {
                // If user scored more than 25% of max, they need improvement (negative suggestion)
                if (userScore > (maxScore / 4)) {
                    categorySuggestions.push({
                        concernCode: concernCode,
                        type: 'negative',
                        // text: suggestionsDB[concernCode].negative, // Currently not implemented
                        categoryTools: suggestionsDB[concernCode].tools,
                        categoryMethodology: suggestionsDB[concernCode].methodology
                    });
                } else {
                    // User is doing well, provide positive reinforcement
                    categorySuggestions.push({
                        concernCode: concernCode,
                        type: 'positive',
                        text: suggestionsDB[concernCode].positive,
                        tools: suggestionsDB[concernCode].tools,
                        methodology: suggestionsDB[concernCode].methodology
                    });
                }
            }
        }

        // Get relevant misconceptions for this category
        const categoryMisconceptions = misconceptionsDB[categoryName] || [];

        // Build category report object
        report[categoryName] = {
            scorePercentage: scorePercentage,
            suggestions: categorySuggestions,
            misconceptions: categoryMisconceptions
        };
    }

    res.status(200).json(report);
});

/**
 * POST /schedule - Schedule assessment reminder emails
 * Sends immediate confirmation email and schedules future assessment email
 */
route.post("/schedule", async (req, res) => {
    const { to, subject, assessmentLink, date, frequency } = req.body;

    // Send immediate confirmation email (non-blocking)
    try {
        await sendEmail(to, subject, emailInitialTemplate(frequency, to));
    } catch (err) {
        console.error(`❌ Failed to send immediate email to ${to}:`, err);
        // Continue execution even if immediate email fails
    }

    // Validate that the scheduled date is in the future
    const jobDate = new Date(date);
    if (jobDate < new Date()) {
        return res.status(400).json({ error: "Date is in the past" });
    }

    // Schedule the actual assessment email for the specified date
    schedule.scheduleJob(jobDate, async () => {
        try {
            await sendEmail(to, subject, emailTemplate(assessmentLink));
        } catch (err) {
            console.error(`❌ Failed to send scheduled email to ${to}:`, err);
        }
    });

    res.json({ success: true, scheduledFor: jobDate });
});

module.exports = route;