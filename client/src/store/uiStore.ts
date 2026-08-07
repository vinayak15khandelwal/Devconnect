import { create } from "zustand";

// Client-only UI state that doesn't belong in server cache (React Query
// owns all server state — this store is intentionally small).
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  notificationsOpen: false,
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
}));
