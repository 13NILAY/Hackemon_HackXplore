const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pako = require('pako');
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};



// Modified decompression middleware
const decompressText = (req, res, next) => {
  if (req.body.extractedText) {
    try {
      const compressed = Uint8Array.from(
        atob(req.body.extractedText), 
        c => c.charCodeAt(0)
      );
      req.body.extractedText = pako.ungzip(compressed, { to: 'string' });
    } catch (error) {
      return res.status(400).json({ error: "Invalid compressed text" });
    }
  }
  next();
};

router.post("/generate-course", async (req, res) => {
    const { category, topic, difficulty, duration, noOfChp, deadline, extractedText } = req.body;
    console.log(req.body);

    const prompt = `
        Generate a Course Tutorial in JSON format with the following details:

        **Priority:** If \`extractedText\` is provided and relevant to the \`topic\`, use it as the primary source for generating the course content. Otherwise, rely on the provided \`category\`, \`topic\`, \`difficulty\`, \`duration\`, and \`noOfChp\` to create the course.

        **Fields:**
        * **Course Name:** (Automatically generated based on topic and category)
        * **Description:** (A brief overview of the course)
        * **Chapters:** (An array of chapter objects)
            * **Chapter Name:**
            * **About:** (A description of the chapter's content)
            * **Duration:** (Estimated time to complete the chapter, e.g., "2 hours", "1.5 days")
            * **Deadline:** (Date by which the chapter should be completed, e.g., "2024-12-20")

        **Input Parameters:**
        * **Category:** ${category}
        * **Topic:** ${topic}
        * **Level:** ${difficulty}
        * **Deadline:** ${deadline }
        * **Duration:** ${duration} (Overall course duration, e.g., "2 weeks", "1 month")
        * **No Of Chapters:** ${noOfChp}
        * **Extracted Text:** ${extractedText} (Content from a textbook, PDF, or study material. Can be an empty string if unavailable.)

        **Instructions:**
        1. **Content Generation:**
            - If \`extractedText\` is present and relevant, use it to create the course content, including the chapter descriptions ("About"). Prioritize information directly related to the \`topic\`. Organize the information from \`extractedText\` into a logical chapter structure. Make sure not to directly copy and paste the content from the extracted text, rewrite the paragraph in a simpler way.
            - If \`extractedText\` is absent or irrelevant, generate the course content based on the provided \`category\`, \`topic\`, and \`difficulty\`. Use your knowledge to create appropriate chapter descriptions.
        
        2. **Chapter Durations:**
            - Divide the overall \`duration\` across the \`noOfChp\` chapters, taking into account the relative complexity and importance of each chapter. Some chapters might require more or less time than others.
        
        3. **Chapter Deadlines:**
            - Calculate a deadline for each chapter based on the overall \`deadlie\` of the course and the individual chapter durations. Distribute the deadlines evenly.
            - Consider the sequence of chapters. If a chapter builds upon previous chapters, the deadline should reflect that dependency. Output format should be in YYYY-MM-DD.
        
        4. **JSON Format:**
            - The output must be valid JSON.
            - The root element should be an object containing "Course Name", "Description", and "Chapters".
            - "Chapters" should be an array of chapter objects.
    `;

    const chatSession = model.startChat({ generationConfig, history: [] });

    try {
        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();
        res.json(JSON.parse(responseText)); // Send parsed JSON response
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate course." });
    }
});

module.exports = router;
