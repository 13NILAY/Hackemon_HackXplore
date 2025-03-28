const { GoogleGenerativeAI } = require("@google/generative-ai");

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

const generateCourseLayout = async (req, res) => {
    try {
        const { skills, topic, difficulty, duration, noOfChp,deadline,extractedText } = req.body;

        const prompt = `
        Generate a JSON object for a course on "${topic}". The course should cover the following skills: ${skills.join(", ")}.
        The course level should be "${difficulty}" and the total duration should be "${duration}" hours, divided into "${noOfChp}" chapters. The overall course deadline is "${deadline}".
        
        **Priority:** If 'extractedText' is provided and relevant to the 'topic', use it as the primary source for generating the course content. Otherwise, rely on the provided information to create the course.
        
        The JSON response should follow this structure:
        {
          "Course Name": "${topic}",
          "Description": "Brief description of the course",
          "Skills": ["${skills.join('", "')}"],
          "Level": "${difficulty}",
          "Duration": "${duration} hours",
          "NoOfChapters": ${noOfChp},
          "OverallDeadline": "${deadline}",
          "Course Outcomes": [
            "Outcome 1",
            "Outcome 2",
            "Outcome 3"
          ],
          "Chapters": [
            {
              "Chapter Name": "Chapter 1 Title",
              "About": "Brief overview of the chapter",
              "Duration": "Duration (in minutes)",
              "Deadline": "YYYY-MM-DD",
              "Content": [
                "Topic 1",
                "Topic 2",
                "Topic 3"
              ]
            },
            // repeat for all chapters
          ]
        }
        
        **Instructions:**
        
        1. **Content Generation:**
           *   **If 'extractedText' is present and relevant:** Use it to create the course content, including the chapter descriptions ("About") and the "Content" list. Prioritize information directly related to the 'topic' and skills.  Organize the information from 'extractedText' into a logical chapter structure.  Make sure not to directly copy and paste the content from the extracted text, rewrite the paragraph in a simpler way.
           *   **If 'extractedText' is absent or irrelevant:** Generate the course content based on the provided 'topic', 'skills', and 'difficulty'. Use your knowledge to create appropriate chapter descriptions and "Content" lists.
        
        2. **Chapter Durations:** Divide the overall 'duration' across the 'noOfChp' chapters, taking into account the relative complexity and importance of each chapter. Some chapters might require more or less time than others.  The duration should be in minutes.
        
        3. **Chapter Deadlines:** Calculate a deadline for each chapter based on the 'overallDeadline' of the course and the individual chapter durations. Distribute the deadlines evenly, but consider if some chapters are prerequisites for others. If a chapter builds upon previous chapters, the deadline should reflect that dependency. The deadline format should be "YYYY-MM-DD".
        
        4. **Course Outcomes:** Generate 3 to 5 relevant course outcomes based on the 'topic' and 'skills'.
        
        5.  **Strict JSON Format:** The output must be valid JSON. Do not include any explanations or introductory text before the JSON object. The JSON object should start immediately.
        
        **Input:**
        
        *   **topic:** "${topic}"
        *   **skills:** ${JSON.stringify(skills)}
        *   **difficulty:** "${difficulty}"
        *   **duration:** "${duration}" (Total course duration in hours)
        *   **noOfChp:** ${noOfChp}
        *   **overallDeadline:** "${deadline}" (Format: YYYY-MM-DD)
        *   **extractedText:** "${extractedText}"
        
        Ensure the response strictly follows this schema in valid JSON format with no additional explanations.
        `;

        const chatSession = model.startChat({ generationConfig, history: [] });
        const aiResponse = await chatSession.sendMessage(prompt);
        const responseText = aiResponse.response.text();

        res.json({ courseLayout: JSON.parse(responseText) });
    } catch (error) {
        console.error("AI generation error:", error);
        res.status(500).json({ error: "Failed to generate course layout." });
    }
};

module.exports = { generateCourseLayout };
