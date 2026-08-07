// Shared TypeScript types used by both client and server

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UserPublic {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface UserSkill {
  skill: Skill;
  endorsementCount: number;
  endorsedByMe?: boolean;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  authorId: string;
  author?: UserPublic;
  title: string;
  slug: string;
  contentMd: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
}

export interface NotificationPayload {
  id: string;
  type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "ENDORSEMENT";
  message: string;
  fromUserId: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
