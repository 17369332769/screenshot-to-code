import { create } from "zustand";
import { AccountSession, HostedProject } from "../lib/account";

interface AccountStore {
  session: AccountSession | null;
  projects: HostedProject[];
  currentProjectId: string | null;
  isAuthLoading: boolean;
  setSession: (session: AccountSession | null) => void;
  setProjects: (projects: HostedProject[]) => void;
  upsertProject: (project: HostedProject) => void;
  removeProject: (projectId: string) => void;
  setCurrentProjectId: (projectId: string | null) => void;
  setIsAuthLoading: (value: boolean) => void;
  clearAccountState: () => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  session: null,
  projects: [],
  currentProjectId: null,
  isAuthLoading: false,
  setSession: (session) => set({ session }),
  setProjects: (projects) => set({ projects }),
  upsertProject: (project) =>
    set((state) => {
      const existing = state.projects.find((item) => item.id === project.id);
      return {
        projects: existing
          ? state.projects.map((item) => (item.id === project.id ? project : item))
          : [project, ...state.projects],
      };
    }),
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((item) => item.id !== projectId),
      currentProjectId:
        state.currentProjectId === projectId ? null : state.currentProjectId,
    })),
  setCurrentProjectId: (projectId) => set({ currentProjectId: projectId }),
  setIsAuthLoading: (value) => set({ isAuthLoading: value }),
  clearAccountState: () =>
    set({
      session: null,
      projects: [],
      currentProjectId: null,
      isAuthLoading: false,
    }),
}));
