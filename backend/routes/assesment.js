const express = require('express');
const category = require('../models/category');
const Misconception = require('../models/misconceptions');
const sendEmail = require('../mailer');
const schedule = require("node-schedule");
const emailTemplate = require('../EmailTemplate');
const emailInitialTemplate = require('../EmailInitialTemplate');
const route = express.Router()


const categoryMappingForScoring = {
    "Digital Identity & Authentication": ["DIT", "SB", "DC", "MPOT", "SE", "CE", "MIC", "PD"],
    "Data Collection & Control": ["DC", "UDU", "GLR", "PD", "ODU", "PA", "DSTP", "LT", "DR", "MPOT", "CD", "LRPG"],
    "Location & Physical Safety": ["GLR", "PD", "ST", "APS", "DC"],
    "Social & Reputation Management": ["ESH", "RD", "LC", "APS", "MPOT", "CD"],
    "Surveillance & Tracking": ["ST", "UDU", "DSTP", "LT", "MPOT"],
    "Transparency & Corporate Trust": ["ODU", "LT", "PA", "LRPG", "MIC", "DSTP"],
    "Legal & Advanced Privacy": ["LRPG", "MPOT", "CD", "DR", "APS", "CE", "ESH", "RD"]
};

const suggestionMapping = {
    "Digital Identity & Authentication": ["DIT", "SB", "SE"],
    "Data Collection & Control": ["DC", "UDU", "PA", "DR"],
    "Location & Physical Safety": ["GLR", "PD", "APS"],
    "Social & Reputation Management": ["ESH", "RD", "LC"],
    "Surveillance & Tracking": ["ST", "DSTP", "LT"],
    "Transparency & Corporate Trust": ["ODU", "MIC", "LRPG"],
    "Legal & Advanced Privacy": ["MPOT", "CE", "CD"]
};

const fetchSuggestions = async () => {
    try {
        const suggestionsArray = await category.find({});
        
        return suggestionsArray.reduce((acc, suggestion) => {
            acc[suggestion.code] = {
                positive: suggestion.positive_suggestion,
                negative: suggestion.negative_suggestion,
                tools: suggestion.tools,
                methodology: suggestion.methodology
            };
            return acc;
        }, {});
    } catch (error) {
        console.error("Error fetching suggestions from DB:", error);
        return {}; // Return empty object on error
    }
};

async function fetchMisconceptions() {
    try {
        const misconceptionDocs = await Misconception.find({});
        const formattedData = {};
        for (const doc of misconceptionDocs) {
            formattedData[doc.categoryName] = doc.misconceptions;
        }
        return formattedData;
    } catch (error) {
        console.error("Error fetching misconception data:", error);
        return {}; // Return an empty object on failure
    }
}

route.post('/report', async function (req, res, next) {
     const [suggestionsDB, misconceptionsDB] = await Promise.all([
        fetchSuggestions(),
        fetchMisconceptions()
    ]);

    if (Object.keys(suggestionsDB).length === 0) {
        return res.status(500).json({ error: "Could not load suggestion data from the database." });
    }
    // ADDED: Check if misconceptions were loaded
    if (Object.keys(misconceptionsDB).length === 0) {
        return res.status(500).json({ error: "Could not load misconception data from the database." });
    }

    const { scores, maxScores } = req.body;

    if (!scores || !maxScores || Object.keys(scores).length === 0) {
        return res.status(400).json({ error: "Request body must contain 'scores' and 'maxScores' objects." });
    }

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

    for (const categoryName in categoryMappingForScoring) {
        const concernsForScoring = categoryMappingForScoring[categoryName];
        let categoryTotalPoints = 0;
        let maxPossiblePointsForCategory = 0;

        for (const concernCode of concernsForScoring) {
            categoryTotalPoints += scores[concernCode] || 0;
            maxPossiblePointsForCategory += maxScores[concernCode] || 0;
        }

        const scorePercentage = maxPossiblePointsForCategory > 0
            ? Math.round(((maxPossiblePointsForCategory - categoryTotalPoints) / maxPossiblePointsForCategory) * 100)
            : 0;

        const categorySuggestions = [];
        const concernsForSuggestions = suggestionMapping[categoryName] || [];

        for (const concernCode of concernsForSuggestions) {
            const userScore = scores[concernCode] || 0;
            const maxScore = maxScores[concernCode] || 0;

            if (suggestionsDB[concernCode] && maxScore > 0) {
                if (userScore > (maxScore / 4)) {
                    categorySuggestions.push({
                        concernCode: concernCode,
                        type: 'negative',
                        text: suggestionsDB[concernCode].negative,
                        categoryTools: suggestionsDB[concernCode].tools,
                        categoryMethodology: suggestionsDB[concernCode].methodology
                    });
                } else {
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
        
        const categoryMisconceptions = misconceptionsDB[categoryName] || [];

        report[categoryName] = {
            scorePercentage: scorePercentage,
            suggestions: categorySuggestions,
            misconceptions: categoryMisconceptions
        };
    }

    res.status(200).json(report);
});


route.post("/schedule", async (req, res) => {
  const { to, subject, assessmentLink, date, frequency } = req.body;

    try {
    await sendEmail(to, subject, emailInitialTemplate(frequency , to));
    console.log(`✅ Immediate email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send immediate email to ${to}:`, err);
  }

  const jobDate = new Date(date);
  if (jobDate < new Date()) return res.status(400).json({ error: "Date is in the past" });

  // Schedule the email
  schedule.scheduleJob(jobDate, async () => {
    try {
      await sendEmail(to, subject, emailTemplate(assessmentLink));
      console.log(`✅ Email sent to ${to} at ${jobDate}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${to}:`, err);
    }
  });

  res.json({ success: true, scheduledFor: jobDate });
});

module.exports = route;