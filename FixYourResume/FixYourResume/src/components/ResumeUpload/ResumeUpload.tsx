import { useState } from "react";
import { UploadCloud } from "lucide-react";
import pdfToText from "react-pdftotext";
import "./ResumeUpload.css";

const ResumeUpload = ({
  onResumeData,
}: {
  onResumeData: (data: { text: string }) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      const text = await extractTextFromPDF(selectedFile);

      onResumeData({ text });
    } else {
      alert("Please upload a valid PDF file.");
      setFile(null);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      pdfToText(file).then((text: string) => {
        resolve(text);
      });
    });
  };

  return (
    <div className="resume-upload-container">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="resume-upload"
      />
      <label htmlFor="resume-upload" className="upload-label">
        <div className="upload-box">
          <UploadCloud className="upload-icon" size={40} />
          <p className="upload-text">Click to upload a PDF</p>
        </div>
      </label>
      {file && <p className="file-name">{file.name}</p>}
      <button className="upload-button" disabled={!file}>
        Resume Uploaded
      </button>
    </div>
  );
};

export default ResumeUpload;
