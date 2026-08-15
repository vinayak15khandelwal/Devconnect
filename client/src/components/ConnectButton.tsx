import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface ConnectionStatus {
  status: "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "ACCEPTED" | "SELF";
  connectionId?: string;
}

// Self-contained: fetches its own status and drives its own mutations so
// Profile.tsx doesn't need to juggle connection state alongside profile edits.
export default function ConnectButton({ username }: { username: string }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["connection-status", username],
    queryFn: async () => (await api.get<{ data: ConnectionStatus }>(`/api/connections/status/${username}`)).data.data,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["connection-status", username] });

  const sendRequest = useMutation({
    mutationFn: () => api.post(`/api/connections/request/${username}`),
    onSuccess: invalidate,
  });

  const respond = useMutation({
    mutationFn: (action: "ACCEPT" | "REJECT") =>
      api.patch(`/api/connections/${data!.connectionId}/respond`, { action }),
    onSuccess: invalidate,
  });

  if (!data || data.status === "SELF") return null;

  if (data.status === "NONE") {
    return (
      <button
        onClick={() => sendRequest.mutate()}
        disabled={sendRequest.isPending}
        className="text-sm border border-brand-600 text-brand-600 hover:bg-brand-50 rounded-md px-3 py-1.5 disabled:opacity-50"
      >
        {sendRequest.isPending ? "Sending..." : "+ Connect"}
      </button>
    );
  }

  if (data.status === "PENDING_SENT") {
    return <span className="text-sm text-gray-400 border border-gray-200 rounded-md px-3 py-1.5">Request sent</span>;
  }

  if (data.status === "PENDING_RECEIVED") {
    return (
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => respond.mutate("ACCEPT")}
          className="bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3 py-1.5"
        >
          Accept
        </button>
        <button
          onClick={() => respond.mutate("REJECT")}
          className="border border-gray-300 hover:bg-gray-50 rounded-md px-3 py-1.5"
        >
          Reject
        </button>
      </div>
    );
  }

  return <span className="text-sm text-brand-600 border border-brand-100 bg-brand-50 rounded-md px-3 py-1.5">✓ Connected</span>;
}
