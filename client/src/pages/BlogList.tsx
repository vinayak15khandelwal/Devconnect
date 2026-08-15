import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import type { BlogPost } from "@shared/index";

interface BlogListResponse {
  posts: BlogPost[];
  page: number;
  pageSize: number;
  total: number;
}

export default function BlogList() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["blog", 1],
    queryFn: async () => (await api.get<{ data: BlogListResponse }>("/api/blog?page=1")).data.data,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-brand-700 dark:text-brand-400">Blog</h1>
          {user && (
            <Link
              to="/blog/new"
              className="text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md px-3 py-1.5"
            >
              Write a post
            </Link>
          )}
        </div>

        {isLoading && <p className="text-gray-400 dark:text-gray-500 text-sm">Loading...</p>}

        {data && data.posts.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm">No posts yet — be the first to write one.</p>
        )}

        <div className="space-y-4">
          {data?.posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{post.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 dark:text-gray-500">
                <span>{post.author?.name}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
