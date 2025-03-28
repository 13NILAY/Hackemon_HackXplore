import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [doubt, setDoubt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleAskDoubt = async () => {
    if (!doubt) return;
    const res = await fetch("http://localhost:8000/api/doubts/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doubt }),
    });
    const data = await res.json();
    
    const newMessage = {
      question: doubt,
      answer: data.answer,
    };
    setChatHistory([...chatHistory, newMessage]);
    setDoubt("");
  };

  return (
    <div>
      {/* Floating Chat Icon */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-700 to-purple-700  p-4 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-blue-600 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col">
          <h2 className="text-lg font-semibold pb-2">AI Chatbot</h2>
          <div className="h-80 overflow-y-auto p-2 rounded mb-2">
            {chatHistory.map((msg, index) => (
              <div key={index} className="mb-2">
              <p className="font-semibold bg-blue-200 shadow-md rounded-md py-2 px-4 inline-block float-right mb-2">{msg.question}</p>
              <p className="text-sm bg-gray-200 shadow-md p-2 rounded float-left">{msg.answer}</p>
            </div>
            
            ))}
          </div>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Ask your doubt..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
          />
          <button
            className="mt-2 p-2 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded w-full cursor-pointer"
            onClick={handleAskDoubt}
          >
            Ask Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
