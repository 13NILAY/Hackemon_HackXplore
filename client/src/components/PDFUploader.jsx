import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Use this working CDN URL for version 3.11.174
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PDFUploader = ({ onPdfProcessed }) => {
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [pdfText, setPdfText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        if (pdfUrl && pdfText) {
            onPdfProcessed(pdfUrl, pdfText);
        }
    }, [pdfUrl, pdfText]);

    const uploadPDF = async () => {
        if (!pdfFile) {
            alert("Please select a PDF first.");
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", pdfFile);
            formData.append("upload_preset", "HackXplore");
            formData.append("cloud_name", "dhk1v7s3d");

            const res = await fetch("https://api.cloudinary.com/v1_1/dhk1v7s3d/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            setPdfUrl(data.secure_url);
            alert("PDF uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload PDF");
        } finally {
            setIsUploading(false);
        }
    };

    const extractTextFromPDF = async () => {
        if (!pdfUrl) {
            alert("Please upload the PDF first.");
            return;
        }

        try {
            setIsExtracting(true);

            const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const textItems = textContent.items.map((item) => item.str);
                fullText += `\n\n--- Page ${i} ---\n` + textItems.join(" ");
            }

            setPdfText(fullText);
        } catch (error) {
            console.error("Text extraction error:", error);
            alert("Failed to extract text from PDF");
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div className="p-5 max-w-md mx-auto">
            <div className="mb-4">
                <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)} 
                    className="w-full"
                />
            </div>

            <button 
                onClick={uploadPDF} 
                disabled={!pdfFile || isUploading}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full disabled:opacity-50"
            >
                {isUploading ? "Uploading..." : "Upload PDF"}
            </button>

            {pdfUrl && (
                <button 
                    onClick={extractTextFromPDF} 
                    disabled={isExtracting}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-2 w-full disabled:opacity-50"
                >
                    {isExtracting ? "Extracting..." : "Extract Text"}
                </button>
            )}

            {pdfUrl && (
                <p className="mt-2 text-sm">
                    ✅ PDF Uploaded: <a 
                        href={pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                    >
                        View PDF
                    </a>
                </p>
            )}

            {pdfText && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Text Extracted ✓</h3>
                </div>
            )}
        </div>
    );
};

export default PDFUploader;