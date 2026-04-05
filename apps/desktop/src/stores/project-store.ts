import { create } from "zustand";
import type { Model } from "@/bindings";

interface ProjectStore {
	selectedProject: Model | null;
	selectProject: (project: Model | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
	selectedProject: null,
	selectProject: (project) => set({ selectedProject: project }),
}));
