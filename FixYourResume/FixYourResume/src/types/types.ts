// src/types/types.ts
export interface JobPostingData {
  title: string;
  description: string;
}

export interface ResumeData {
  text: string;
}
export interface Suggestion {
  type: "keyword" | "section";
  message: string;
}
