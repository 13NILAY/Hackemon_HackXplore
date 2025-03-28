const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();
const API_KEY = process.env.GEMINI_API_KEY;

const sampleText = `
There are times when the requirements for a problem are well understood—when

work flows from communication through deployment in a reasonably linear fash-
ion. This situation is sometimes encountered when well-defined adaptations or en-
hancements to an existing system must be made (e.g., an adaptation to accounting

software that has been mandated because of changes to government regulations). It
may also occur in a limited number of new development efforts, but only when
requirements are well defined and reasonably stable.
The waterfall model, sometimes called the classic life cycle, suggests a systematic,

sequential approach6 to software development that begins with customer specifica-
tion of requirements and progresses through planning, modeling, construction, and

deployment, culminating in ongoing support of the completed software 
A variation in the representation of the waterfall model is called the V-model.

Communication
project initiation
requirements gathering

Planning
estimating
scheduling
tracking

Modeling
analysis
design Deployment
delivery
support
feedback

Construction
code
test


Although the original waterfall model proposed by Winston Royce [Roy70] made provision for
“feedback loops,” the vast majority of organizations that apply this process model treat it as if it
were strictly linear.

Prescriptive process
models define a
prescribed set of
process elements and
a predictable process
work flow.

assurance actions to the actions associated with communication, modeling, and
early construction activities. As a software team moves down the left side of the V,

basic problem requirements are refined into progressively more detailed and techni-
cal representations of the problem and its solution. Once code has been generated,

the team moves up the right side of the V, essentially performing a series of tests
(quality assurance actions) that validate each of the models created as the team
moved down the left side.7 In reality, there is no fundamental difference between the
classic life cycle and the V-model. The V-model provides a way of visualizing how
verification and validation actions are applied to earlier engineering work.
The waterfall model is the oldest paradigm for software engineering. However,
over the past three decades, criticism of this process model has caused even ardent
supporters to question its efficacy [Han95]. Among the problems that are sometimes
encountered when the waterfall model is applied are:
`;

// ✅ Function to find the most relevant sentence based on the user's doubt
const findRelevantSentence = (text, doubt) => {
    const sentences = text.split(". ").map(s => s.trim());
    let bestSentence = "";
    let bestScore = 0;

    sentences.forEach(sentence => {
        let score = similarity(sentence, doubt);
        if (score > bestScore) {
            bestScore = score;
            bestSentence = sentence;
        }
    });

    return bestSentence;
};

// ✅ Function to calculate similarity (matching words)
const similarity = (sentence, doubt) => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    const doubtWords = doubt.toLowerCase().split(/\s+/);
    return doubtWords.filter(word => sentenceWords.includes(word)).length;
};

// ✅ Function to fetch explanation from Gemini API
const getGeminiExplanation = async (keySentence, doubt) => {
    const userInput = `The student asked: "${doubt}". The key passage is: "${keySentence}". Explain this passage in a clear, human-like way.`;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY,
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userInput }] }],
                }),
            }
        );

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            console.error("API Error:", data.error.message);
            return "I couldn't generate an explanation at this moment.";
        } else {
            console.error("Unexpected response structure:", data);
            return "Unexpected API response.";
        }
    } catch (error) {
        console.error("Error:", error);
        return "I couldn't generate an explanation at this moment.";
    }
};

// ✅ Route to solve doubt
router.post("/solve", async (req, res) => {
    const { doubt } = req.body;

    if (!doubt) {
        return res.status(400).json({ error: "Doubt is required" });
    }

    const keySentence = findRelevantSentence(sampleText, doubt);

    if (!keySentence) {
        return res.json({ answer: "I couldn't find relevant information in the provided text." });
    }

    try {
        const explanation = await getGeminiExplanation(keySentence, doubt);
        res.json({ keySentence, answer: explanation });
    } catch (error) {
        console.error("Error generating explanation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
