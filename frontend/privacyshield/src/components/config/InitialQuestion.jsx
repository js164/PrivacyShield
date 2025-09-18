/**
 * Initial assessment question configuration
 * Serves as the entry point for the privacy assessment survey
 */
export const INITIAL_QUESTION = {
    id: 'q0',                                  // Unique question identifier
    text: 'When it comes to your privacy and safety online, which of these concerns you the most?',
    type: 'multiple',                          // Question type (multiple choice)
    options: [
        {
            id: 'q0_opt1',
            text: 'Someone stealing or misusing my online accounts and passwords',
            category: 'DIA'                    // Maps to Digital Identity & Authentication
        },
        {
            id: 'q0_opt2',
            text: 'Companies collecting and sharing my personal data without my control',
            category: 'DCC'                    // Maps to Data Collection & Control
        },
        {
            id: 'q0_opt3',
            text: 'Apps or services tracking my physical location and movements',
            category: 'LPS'                    // Maps to Location & Physical Safety
        },
        {
            id: 'q0_opt4',
            text: 'People judging me or damaging my reputation based on my online activity',
            category: 'SRM'                    // Maps to Social & Reputation Management
        },
        {
            id: 'q0_opt5',
            text: 'Being monitored or watched online or offline without my knowledge',
            category: 'ST'                     // Maps to Surveillance & Tracking
        },
        {
            id: 'q0_opt6',
            text: 'I don’t trust companies to be honest or clear about how they use my personal data',
            category: 'TCT'                    // Maps to Transparency & Corporate Trust
        },
        {
            id: 'q0_opt7',
            text: 'Privacy laws and rules not protecting me well enough',
            category: 'LAP'                    // Maps to Legal & Advanced Privacy
        },
    ]
};