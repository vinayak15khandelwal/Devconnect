import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import type { UserPublic } from "@shared/index";

interface ConnectionRecord {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  requester: UserPublic;
  addressee?: UserPublic;
}

export default function Connections() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ["connections-pending"],
    queryFn: async () => (await api.get<{ data: ConnectionRecord[] }>("/api/connections/pending")).data.data,
  });

  const { data: accepted, isLoading: acceptedLoading } = useQuery({
    queryKey: ["connections-accepted"],
    queryFn: async () => (await api.get<{ data: ConnectionRecord[] }>("/api/connections")).data.data,
  });

  const respond = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "ACCEPT" | "REJECT" }) =>
      api.patch(`/api/connections/${id}/respond`, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections-pending"] });
      queryClient.invalidateQueries({ queryKey: ["connections-accepted"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/connections/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connections-accepted"] }),
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-xl font-bold text-brand-700 dark:text-brand-400">Connections</h1>

        {/* Pending requests received */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Pending requests</h2>
          {pendingLoading && <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>}
          {pending && pending.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">No pending requests.</p>}
          <div className="space-y-3">
            {pending?.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <Link to={`/u/${c.requester.username}`} className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={c.requester.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${c.requester.name}`}
                    alt={c.requester.name}
                    className="w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{c.requester.name}</span>
                </Link>
                <div className="flex gap-2 text-sm shrink-0">
                  <button
                    onClick={() => respond.mutate({ id: c.id, action: "ACCEPT" })}
                    className="bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3 py-1.5"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respond.mutate({ id: c.id, action: "REJECT" })}
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accepted connections */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Your connections</h2>
          {acceptedLoading && <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>}
          {accepted && accepted.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">No connections yet.</p>}
          <div className="space-y-3">
            {accepted?.map((c) => {
              // The logged-in user could be in either the requester or addressee
              // slot on a given row — show whichever side isn't them.
              const other = c.requester.id === currentUser?.id ? c.addressee! : c.requester;
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <Link to={`/u/${other.username}`} className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={other.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${other.name}`}
                      alt={other.name}
                      className="w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{other.name}</span>
                  </Link>
                  <button
                    onClick={() => remove.mutate(c.id)}
                    className="text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 shrink-0 px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
