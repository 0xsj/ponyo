import { AuthCredentials } from "./core";

export interface SignUpDTO extends AuthCredentials {
  username: string;
}

export interface VerifyEmailDTO {
  email: string;
  token: string;
}

export interface CreateUserDTO {
  id: string;
  email: string;
  username: string;
  isActive: boolean | number;
}

export interface UpdateUserDTO {
  email?: string;
  username: string;
  isActive: boolean;
}

export interface CreatePostInput {
  content: string;
  languageId: number;
  userId: string;
}

export interface UpdateUserInput {
  content?: string;
  languageId?: number;
}
