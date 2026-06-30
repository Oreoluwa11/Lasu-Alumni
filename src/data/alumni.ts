type LegacyAlumniProfile = {
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
};

export const alumniProfiles: LegacyAlumniProfile[] = [
  {
    id: "1",
    fullName: "Aisha Bello",
    occupation: "Product Manager",
    company: "Tech Spring",
    graduationYear: 2019,
    faculty: "Management Sciences",
    department: "Business Administration",
    industry: "Product",
    location: "Lagos",
    bio: "Passionate about product strategy, career coaching, and leadership development.",
    skills: ["Product Management", "Mentorship", "Strategy"],
  },
  {
    id: "2",
    fullName: "David Okoro",
    occupation: "Data Analyst",
    company: "Future Insights",
    graduationYear: 2018,
    faculty: "Science",
    department: "Computer Science",
    industry: "Analytics",
    location: "Abuja",
    bio: "Helps students build data skills and find meaningful careers in analytics.",
    skills: ["Data Analysis", "Python", "Visualization"],
  },
  {
    id: "3",
    fullName: "Chidera Nwafor",
    occupation: "Software Engineer",
    company: "Greenbyte",
    graduationYear: 2020,
    faculty: "Engineering",
    department: "Computer Engineering",
    industry: "Software",
    location: "Lagos",
    bio: "Experienced in mentoring young engineers on modern web development and cloud." ,
    skills: ["React", "TypeScript", "Cloud"],
  },
];
