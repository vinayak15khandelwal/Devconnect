import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
// Self-contained: fetches its own status and drives its own mutations so
// Profile.tsx doesn't need to juggle connection state alongside profile edits.
export default function ConnectButton({ username }) {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["connection-status", username],
        queryFn: async () => (await api.get(`/api/connections/status/${username}`)).data.data,
    });
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["connection-status", username] });
    const sendRequest = useMutation({
        mutationFn: () => api.post(`/api/connections/request/${username}`),
        onSuccess: invalidate,
    });
    const respond = useMutation({
        mutationFn: (action) => api.patch(`/api/connections/${data.connectionId}/respond`, { action }),
        onSuccess: invalidate,
    });
    // Loading: render nothing — a brief flash before the button appears is
    // normal UX. Errored: DON'T render nothing — that's what was making a
    // failed request (expired token, transient 401/500, etc.) indistinguishable
    // from "this is your own profile." Surface it instead, with a retry.
    if (isLoading)
        return null;
    if (isError) {
        const status = error?.response?.status;
        return (_jsxs("button", { onClick: () => refetch(), title: error?.response?.data?.message || error?.message, className: "text-sm text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/30", children: ["Couldn't load status", status ? ` (${status})` : "", " \u2014 retry"] }));
    }
    if (!data || data.status === "SELF")
        return null;
    if (data.status === "NONE") {
        return (_jsx("button", { onClick: () => sendRequest.mutate(), disabled: sendRequest.isPending, className: "text-sm border border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/40 rounded-md px-3 py-1.5 disabled:opacity-50", children: sendRequest.isPending ? "Sending..." : "+ Connect" }));
    }
    if (data.status === "PENDING_SENT") {
        return _jsx("span", { className: "text-sm text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5", children: "Request sent" });
    }
    if (data.status === "PENDING_RECEIVED") {
        return (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("button", { onClick: () => respond.mutate("ACCEPT"), className: "bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3 py-1.5", children: "Accept" }), _jsx("button", { onClick: () => respond.mutate("REJECT"), className: "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-3 py-1.5", children: "Reject" })] }));
    }
    return _jsx("span", { className: "text-sm text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/30 rounded-md px-3 py-1.5", children: "\u2713 Connected" });
}
