export interface Profile {
  id: string;
  bio: string | null;
  country: string | null;
  createdAt: string | null;
  firstName: string | null;
  lastName: string | null;
  nativeLanguage: string | null;
  profilePictureUrl: string | null;
  targetLanguage: string | null;
  updatedAt: string | null;
}

export interface Post {
  id: number;
  content: string;
  createdAt: string | null;
  languageId: number | null;
  updatedAt: string | null;
  userId: string | null;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string | null;
  isRead: boolean | null;
  receiverId: string | null;
  senderId: string | null;
}

export interface Language {
  id: number;
  code: string;
  name: string;
}

export interface UserLanuage {
  id: number;
  languageId: number | null;
  type: string | null;
  userId: string | null;
}

export interface User {
  createdAt: string | null;
  email: string;
  id: string;
  isActive: boolean | number;
  updatedAt: string | null;
  username: string;
}
