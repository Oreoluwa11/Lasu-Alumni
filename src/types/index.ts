export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'alumni';
  status?: string;
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

export interface MentorshipRequestWithStudent extends MentorshipRequest {
  student: {
    id: string;
    fullName: string;
    profileImage?: string;
    department: string;
    faculty: string;
    graduationYear: number;
  };
}

export interface Conversation {
  id: string;
  studentId: string;
  alumniId: string;
  mentorshipRequestId?: string;
  createdAt: string;
  otherUser?: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}
