export interface StructuredMetadata {
  email?: string;
  phone?: string;
  location?: string;
  education: {
    degree?: string;
    institution?: string;
    year?: string;
  }[];
  experience: {
    title?: string;
    company?: string;
    duration?: string;
    summary?: string;
  }[];
  topSkills: string[];
}

export interface ResumeData {
  id: string;
  name: string;
  content: string;
  fileName: string;
  metadata?: StructuredMetadata;
}

export interface DetailedScore {
  category: string;
  score: number;
  label: 'Strong' | 'Good Start' | 'Needs Work';
}

export interface ATSCheckItem {
  type: 'success' | 'improvement';
  text: string;
}

export interface RankingResult {
  resumeId: string;
  name: string;
  email?: string;
  score: number; 
  detailedScores: {
    toneStyle: { score: number; label: string };
    content: { score: number; label: string };
    structure: { score: number; label: string };
    skills: { score: number; label: string };
  };
  atsScore: number;
  atsChecklist: ATSCheckItem[];
  matchedSkills: string[];
  missingSkills: string[];
  justification: string;
  recommendation: 'Strong Match' | 'Potential Match' | 'Not Recommended';
  metadata?: StructuredMetadata;
}

export interface ProcessingState {
  isAnalyzing: boolean;
  error: string | null;
  progress: number;
}