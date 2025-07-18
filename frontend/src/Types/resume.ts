
export interface ContactInfo {
  name: string;
  title: string; // Engineer"
  email: string;
  phone: string;
  linkedin: string; // URL
  website: string; // Portfolio URL
  location: string; 
}

export interface Experience {
  id: string; // ID for React lists
  jobTitle: string;
  company: string;
  location: string;
  startDate: string; // "YYYY-MM" / "Month YYYY"
  endDate: string; // "YYYY-MM" / "Month YYYY" or "Present"
  description: string[]; 
}

export interface Education {
  id: string;
  degree: string; 
  university: string;
  location: string;
  gpa?: string; 
}

export interface Skill {
  id: string;
  category: string; 
  names: string[]; 
}

export interface Project {
  id: string;
  name: string;
  description: string[]; // arr of bullet points
  technologies: string[];
  link: string; 
}

export interface ResumeData {
  contactInfo: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  templateId: string; 
}

//default empty resume data
export const initialResumeData: ResumeData = {
  contactInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    linkedin: "",
    website: "",
    location: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  templateId: "classic", // Default template
};