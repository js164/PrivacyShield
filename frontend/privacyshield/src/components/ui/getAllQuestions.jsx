// ============================================================================
// GETALLQUESTIONS.JS - API Service for Fetching Questions
// ============================================================================

import axios from 'axios';

/**
 * Fetches all assessment questions from the backend API
 * 
 * This function handles the API call to retrieve the complete set of 
 * privacy assessment questions used in the survey flow.
 * 
 * @returns {Promise<Object|null>} - Returns question data on success, null on failure
 * @throws {Error} - Throws error if API call fails
 */
const getAllQuestions = async () => {
    try {
        // Make GET request to questions endpoint
        const response = await axios.get('/question/questions');

        // Check for successful response status
        if (response.status == 200) {
            return response.data;          // Return the questions data
        } else {
            return null;                   // Return null for non-200 status
        }

    } catch (err) {
        // Log error for debugging purposes
        console.error('Error fetching questions:', err);
        throw err;                         // Re-throw error for caller to handle
    }
};

export default getAllQuestions;
