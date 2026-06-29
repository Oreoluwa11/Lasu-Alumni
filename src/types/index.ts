export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'alumni';
  faculty: string;
  department: string;
  graduationYear: number;
  company?: string;
  jobTitle?: string;
  location: string;
  bio: string;
  skills: string[];
  profileImage?: string;
}

export interface AlumniProfile {
  id: string;
  fullName: string;
  occupation: string;
  company: string;
  graduationYear: number;
  faculty: string;
  department: string;
  industry: string;
  location: string;
  bio: string;
  skills: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: string;
  publishedAt: string;
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  alumniId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
