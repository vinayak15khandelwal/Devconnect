import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

interface MutualUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export default function MutualConnections({ username }: { username: string }) {
  const { data } = useQuery({
    queryKey: ["mutual-connections", username],
    queryFn: async () => (await api.get<{ data: MutualUser[] }>(`/api/connections/mutual/${username}`)).data.data,
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
      <div className="flex -space-x-2">
        {data.slice(0, 3).map((u) => (
          <img
            key={u.id}
            src={u.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${u.name}`}
            alt={u.name}
            title={u.name}
            className="w-6 h-6 rounded-full object-cover bg-gray-100 border-2 border-white"
          />
        ))}
      </div>
      <span>
        {data.length} mutual connection{data.length !== 1 ? "s" : ""}
        {data[0] && (
          <>
            {" "}— including{" "}
            <Link to={`/u/${data[0].username}`} className="text-brand-600 hover:underline">
              {data[0].name}
            </Link>
          </>
        )}
      </span>
    </div>
  );
}
