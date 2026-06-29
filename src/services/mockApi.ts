import { alumniProfiles } from "@/data/alumni";
import { newsArticles } from "@/data/news";
import { mentorshipRequests } from "@/data/mentorship";
import { mockUsers } from "@/data/users";

export const api = {
  getUser: async (id: string) => {
    return mockUsers.find((user) => user.id === id) ?? null;
  },
  getAlumni: async () => {
    return alumniProfiles;
  },
  getAlumniById: async (id: string) => {
    return alumniProfiles.find((alumni) => alumni.id === id) ?? null;
  },
  getNews: async () => {
    return newsArticles;
  },
  getNewsBySlug: async (slug: string) => {
    return newsArticles.find((article) => article.id === slug) ?? null;
  },
  getMentorshipRequests: async (studentId: string) => {
    return mentorshipRequests.filter((request) => request.studentId === studentId);
  },
};
