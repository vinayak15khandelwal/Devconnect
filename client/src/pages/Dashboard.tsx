import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ConnectButton from "../components/ConnectButton";
import type { BlogPost } from "@shared/index";

interface DashboardResponse {
  feed: BlogPost[];
  trending: BlogPost[];
  suggestions: { id: string; name: string; username: string; avatarUrl: string | null }[];
  stats: { projects: number; posts: number; connections: number };
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get<{ data: DashboardResponse }>("/api/dashboard")).data.data,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Welcome back, <span className="font-semibold">{user?.name}</span>.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Projects" value={data?.stats.projects} />
          <StatCard label="Posts" value={data?.stats.posts} />
          <StatCard label="Connections" value={data?.stats.connections} />
        </div>

        {isLoading && <p className="text-gray-400 dark:text-gray-500 text-sm">Loading...</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main column: activity feed + trending */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Activity from your connections</h2>
              {data && data.feed.length === 0 && (
                <EmptyCard>
                  Connect with other developers to see their posts here.{" "}
                  <Link to="/search" className="text-brand-600 dark:text-brand-400 hover:underline">
                    Find developers
                  </Link>
                </EmptyCard>
              )}
              <div className="space-y-3">
                {data?.feed.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Trending on DevConnect</h2>
              {data && data.trending.length === 0 && <EmptyCard>Nothing trending yet — be the first to post.</EmptyCard>}
              <div className="space-y-3">
                {data?.trending.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: connection suggestions */}
          <aside>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">People you may know</h2>
            {data && data.suggestions.length === 0 && <EmptyCard>No suggestions right now.</EmptyCard>}
            <div className="space-y-3">
              {data?.suggestions.map((s) => (
                <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                  <Link to={`/u/${s.username}`} className="flex items-center gap-3 min-w-0">
                    <img
                      src={s.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${s.name}`}
                      alt={s.name}
                      className="w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{s.name}</span>
                  </Link>
                  <div className="mt-3">
                    <ConnectButton username={s.username} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-center">
      <p className="text-2xl font-bold text-brand-700 dark:text-brand-400">{value ?? "—"}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-sm text-gray-400 dark:text-gray-500">
      {children}
    </div>
  );
}

function PostRow({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition"
    >
      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{post.title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{post.excerpt}</p>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
        <span>{post.author?.name}</span>
        <span>·</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
