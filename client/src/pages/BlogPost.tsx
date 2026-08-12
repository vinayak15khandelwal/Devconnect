import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { BlogPost as BlogPostType } from "@shared/index";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => (await api.get<{ data: BlogPostType }>(`/api/blog/${slug}`)).data.data,
    enabled: !!slug,
  });

  const deletePost = useMutation({
    mutationFn: () => api.delete(`/api/blog/${post!.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      navigate("/blog");
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (error || !post)
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Post not found.</div>;

  const isAuthor = user?.id === post.authorId;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <article className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <Link to="/blog" className="text-sm text-brand-600 hover:underline">
          ← All posts
        </Link>

        <div className="flex items-start justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <Link to={`/u/${post.author?.username}`} className="hover:text-brand-600">
                {post.author?.name}
              </Link>
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-3 text-sm shrink-0">
              <Link to={`/blog/${post.slug}/edit`} className="text-brand-600 hover:underline">
                Edit
              </Link>
              <button
                onClick={() => confirm("Delete this post?") && deletePost.mutate()}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="markdown-body mt-6">
          <ReactMarkdown>{post.contentMd}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
