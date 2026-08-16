import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { getSocket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";

interface NotificationRecord {
  id: string;
  type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "ENDORSEMENT";
  message: string;
  read: boolean;
  createdAt: string;
  fromUser: { id: string; name: string; username: string; avatarUrl: string | null } | null;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get<{ data: NotificationRecord[] }>("/api/notifications")).data.data,
    enabled: !!user,
  });

  // AuthContext connects the socket synchronously before `user` updates
  // (on login/register/session-restore), so by the time this effect runs
  // with a truthy `user`, getSocket() is guaranteed to return the live
  // connection rather than null.
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;

    function handleNotification() {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user, queryClient]);

  // Close the dropdown on an outside click.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/api/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (!user) return null;

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-20">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Notifications
          </div>

          {(!notifications || notifications.length === 0) && (
            <p className="px-4 py-6 text-sm text-gray-400 dark:text-gray-500 text-center">No notifications yet.</p>
          )}

          {notifications?.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markRead.mutate(n.id)}
              className={
                "px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 flex items-start gap-3 cursor-pointer " +
                (n.read ? "" : "bg-brand-50/50 dark:bg-brand-900/10")
              }
            >
              <img
                src={n.fromUser?.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${n.fromUser?.name || "?"}`}
                alt=""
                className="w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {n.fromUser ? (
                    <Link to={`/u/${n.fromUser.username}`} className="font-medium hover:text-brand-600 dark:hover:text-brand-400">
                      {n.fromUser.name}
                    </Link>
                  ) : (
                    <span className="font-medium">Someone</span>
                  )}{" "}
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
