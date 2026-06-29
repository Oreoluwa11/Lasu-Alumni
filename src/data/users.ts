import type { User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "student-1",
    fullName: "Olumide Ade",
    email: "olumide.ade@example.com",
    role: "student",
    faculty: "Management Sciences",
    department: "Accounting",
    graduationYear: 2025,
    location: "Ikeja, Lagos",
    bio: "Business student preparing for a career in corporate finance and consulting.",
    skills: ["Accounting", "Excel", "Communication"],
  },
  {
    id: "alumni-1",
    fullName: "Aisha Bello",
    email: "aisha.bello@example.com",
    role: "alumni",
    faculty: "Management Sciences",
    department: "Business Administration",
    graduationYear: 2019,
    company: "Tech Spring",
    jobTitle: "Product Manager",
    location: "Lagos",
    bio: "Passionate about product strategy, career coaching, and leadership development.",
    skills: ["Product Management", "Mentorship", "Strategy"],
  },
];
