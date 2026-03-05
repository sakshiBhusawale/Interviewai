import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateMCQs = async (category, count = 10) => {
    let sectionPrompt = '';

    if (category === 'mah-mca-cet') {
        sectionPrompt = `The focus must be strictly on these 4 sections for MAH MCA CET 2026:
        1. Mathematics & Statistics (30%): Algebra (Sets, matrices, permutations), Coordinate Geometry (Lines, Circles, Parabolas), Calculus (Limits, Differentiation, Integration), Probability & Statistics, Trigonometry, Mensuration.
        2. Logical/Abstract Reasoning (30%): Series, coding-decoding, blood relations, direction sense, clock/calendar, critical reasoning, pattern recognition.
        3. English Comprehension & Verbal Ability (20%): Reading comprehension, vocabulary, grammar, synonyms/antonyms, sentence correction, idioms.
        4. Computer Concepts (20%): CPU, memory, OS (Windows/Linux), Data Representation (Binary/Hex/2's complement), Computer Architecture, C Programming, Data Structures, DBMS.
        Generate a balanced mix of these sections.`;
    } else if (category === 'nimcet') {
        sectionPrompt = 'The focus must be strictly on: 1. Mathematics (Set Theory, Vectors, Probability, Coordinate Geometry, Calculus), 2. Analytical Ability & Logical Reasoning, 3. Computer Basics (Binary/Hexadecimal conversion, Logic Gates, Memory). Generate a balanced mix.';
    } else {
        sectionPrompt = `The focus should be on core concepts and practical application of ${category}.`;
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert examiner for ${category}. Generate ${count} challenging, exam-style multiple-choice questions (MCQs). ${sectionPrompt} Each MCQ must have a question, 4 options, the exact correct answer, and a clear step-by-step explanation. Return the response in JSON format as an array of objects with fields: "question", "options" (array of strings), "correctAnswer" (exact string from options), "section" (e.g., Math, Logic, etc.), and "explanation".`,
                },
                {
                    role: 'user',
                    content: `Generate ${count} high-quality MCQs with explanations for the ${category} exam.`,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
        });

        const content = JSON.parse(chatCompletion.choices[0].message.content);
        return content.mcqs || content.questions || content;
    } catch (error) {
        console.error('Groq MCQ Error:', error);
        throw new Error('Failed to generate MCQs');
    }
};
