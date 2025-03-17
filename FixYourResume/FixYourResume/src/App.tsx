import { useState, useEffect } from "react";
import { JobPostingData, ResumeData, Suggestion } from "./types/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import "./App.css";
import ResumeUpload from "./components/ResumeUpload/ResumeUpload";
import JobPostingInput from "./components/JobPostingInput/JobPostingInput";
import Suggestions from "./components/Suggestions/Suggestions";

function App() {
  const [jobData, setJobData] = useState<JobPostingData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.GOOGLE_API_KEY

  useEffect(() => {
    if (!apiKey) {
      console.error(
        "Gemini API key not found. Make sure it's in your .env file."
      );
    }
  }, [apiKey]);

  const handleJobData = (data: JobPostingData) => {
    setJobData(data);
  };

  const handleResumeData = (data: ResumeData) => {
    setResumeData(data);
  };

  const analyzeResumeAndJob = async () => {
    if (!apiKey) {
      alert("API key not found. Check the console for details.");
      return;
    }

    if (!jobData || !resumeData) {
      alert("Please upload a resume and enter a job posting URL.");
      return;
    }

    setLoading(true);
    setSuggestions([]); // Clear previous suggestions
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        I have a resume:
        ${resumeData.text}

        And a job description:
        ${jobData.title}
        ${jobData.description}

        Provide a list of specific, actionable suggestions to improve the resume for this job.
        Focus on:
        * Keywords to add or change
        * Sections to add or modify (e.g., skills, experience, summary)
        * Specific achievements or responsibilities to highlight
        Format each suggestion as:
        Type: [keyword | section]
        Message: [the suggestion]
        Limit suggestions to 5.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Parse the response (this will be a simplified parsing, you might need a more robust one)
      const parsedSuggestions: Suggestion[] = text
        .split("\n")
        .filter((line) => line.trim() !== "") // Remove empty lines
        .reduce((acc: Suggestion[], line, index, arr) => {
          if (line.startsWith("Type:")) {
            const type = line.split(":")[1].trim() as "keyword" | "section";
            if (arr[index + 1] && arr[index + 1].startsWith("Message:")) {
              const message = arr[index + 1].split(":")[1].trim();
              acc.push({ type, message });
            }
          }
          return acc;
        }, []);

      setSuggestions(parsedSuggestions);
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      alert(`Error generating suggestions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="app-title">Resume and Job Analyzer</h1>
      <div className="app-container">
        <ResumeUpload onResumeData={handleResumeData} />
        <div className="section">
          <JobPostingInput onJobData={handleJobData} />
        </div>
      </div>
      <button
        className="analyze-button"
        onClick={analyzeResumeAndJob}
        disabled={loading || !jobData || !resumeData}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      <Suggestions suggestions={suggestions} />
      {jobData && (
        <div className="debug-section">
          <h2>Job Data (Debug)</h2>
          <p>
            <b>Description:</b>
          </p>
          <ReactMarkdown>{jobData.description}</ReactMarkdown>
        </div>
      )}
      {resumeData && (
        <div className="debug-section">
          <h2>Resume Data (Debug)</h2>
          <p>{resumeData.text.substring(0, 500)}...</p>
        </div>
      )}
    </div>
  );
}

export default App;
