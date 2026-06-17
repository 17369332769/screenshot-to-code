import { HTTP_BACKEND_URL } from "../config";
import { AppState } from "../types";
import { Stack } from "./stacks";
import type { Commit } from "../components/commits/types";

export interface AccountUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface UsageInfo {
  totalGenerations: number;
  remainingFreeGenerations: number;
  limit: number;
}

export interface AccountSession {
  user: AccountUser;
  usage: UsageInfo;
}

export interface HostedProject {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  appState: AppState | string;
  stack: Stack | null;
  inputMode: "image" | "video" | "text" | null;
  initialPrompt: string;
  referenceImages: string[];
  commits: Record<string, Commit>;
  head: string | null;
  latestCommitHash: string | null;
}

export interface SaveHostedProjectPayload {
  name: string;
  appState: AppState;
  stack: Stack | null;
  inputMode: "image" | "video" | "text" | null;
  initialPrompt: string;
  referenceImages: string[];
  commits: Record<string, Commit>;
  head: string | null;
  latestCommitHash: string | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${HTTP_BACKEND_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchSession(): Promise<AccountSession> {
  return request<AccountSession>("/api/me", { method: "GET" });
}

export async function login(email: string): Promise<AccountSession> {
  return request<AccountSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function logout(): Promise<void> {
  return request<void>("/api/auth/logout", { method: "POST" });
}

export async function fetchProjects(): Promise<HostedProject[]> {
  return request<HostedProject[]>("/api/projects", { method: "GET" });
}

export async function fetchProject(projectId: string): Promise<HostedProject> {
  return request<HostedProject>(`/api/projects/${projectId}`, { method: "GET" });
}

export async function createProject(
  payload: SaveHostedProjectPayload
): Promise<HostedProject> {
  return request<HostedProject>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(
  projectId: string,
  payload: SaveHostedProjectPayload
): Promise<HostedProject> {
  return request<HostedProject>(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  return request<void>(`/api/projects/${projectId}`, {
    method: "DELETE",
  });
}
