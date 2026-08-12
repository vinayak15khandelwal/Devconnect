import { create } from "zustand";
export const useUIStore = create((set) => ({
    sidebarOpen: false,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    notificationsOpen: false,
    setNotificationsOpen: (open) => set({ notificationsOpen: open }),
}));
