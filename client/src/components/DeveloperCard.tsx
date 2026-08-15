import { Link } from "react-router-dom";

interface DeveloperSummary {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
}

export default function DeveloperCard({ dev }: { dev: DeveloperSummary }) {
  return (
    <Link
      to={`/u/${dev.username}`}
      className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <img
          src={dev.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${dev.name}`}
          alt={dev.name}
          className="w-12 h-12 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{dev.name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">@{dev.username}</p>
        </div>
      </div>

      {dev.bio && <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">{dev.bio}</p>}
      {dev.location && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">📍 {dev.location}</p>}

      {dev.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {dev.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          {dev.skills.length > 4 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">+{dev.skills.length - 4} more</span>
          )}
        </div>
      )}
    </Link>
  );
}
