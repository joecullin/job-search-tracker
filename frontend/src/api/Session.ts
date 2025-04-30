import { create } from "zustand";

interface SessionState {
    hideDemoWarning: boolean;
    setHideDemoWarning: (value: boolean) => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
    hideDemoWarning: false,
    setHideDemoWarning: (value) => set(() => ({ hideDemoWarning: value })),
}));
