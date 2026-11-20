export interface ProfileData {
  name: string;
  alternateName?: string;
  typedStrings: string[];
  role: string;
  profileImage: string;
  resumeUrl?: string;
  statusQuote: string;
}

export interface AboutData {
  title: string;
  paragraphs: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  insights: string[];
  githubUrl: string;
  demoUrl?: string;
  accentColor?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  icon: string;
  note?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: SkillItem[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  image: string;
  link?: string;
  accentColor?: string;
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  linkedinUser: string;
  github: string;
  githubUser: string;
  twitter?: string;
  twitterUser?: string;
}

export interface ContactData {
  heading: string;
  subheading: string;
  social: SocialLinks;
}

export interface PortfolioData {
  profile: ProfileData;
  about: AboutData;
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  certifications: CertificationItem[];
  contact: ContactData;
}

