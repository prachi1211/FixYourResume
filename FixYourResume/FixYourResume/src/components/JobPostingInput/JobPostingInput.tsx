import React, { useState } from "react";
import { JobPostingData } from "../../types/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./JobPostingInput.css"; // Import the CSS file for styling

interface JobPostingInputProps {
  onJobData: (data: JobPostingData) => void;
}

const JobPostingInput: React.FC<JobPostingInputProps> = ({ onJobData }) => {
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiKey = import.meta.env.GOOGLE_API_KEY;

  const fetchJobDescription = async () => {
    setLoading(true);
    setError("");
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Summarize the following job description in a concise and informative way, highlighting the key responsibilities, required skills, and overall purpose of the role.  Focus on the most important aspects for someone considering applying for the job.  Keep it brief, ideally under 200 words:\n\n${jobDesc}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      onJobData({
        title: "Job Description",
        description: text,
      });
    } catch (err: any) {
      console.error("Error summarizing job description:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-post-input">
      <h2 className="input-title">Job Post Description</h2>
      <textarea
        placeholder="Enter the job description"
        rows={7}
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        className="job-desc-textarea"
      />
      <button
        className="analyze-button"
        onClick={fetchJobDescription}
        disabled={loading || !jobDesc}
      >
        {loading ? "Analyzing..." : "Enter Job Description"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default JobPostingInput;
