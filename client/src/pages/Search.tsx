import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import DeveloperCard from "../components/DeveloperCard";
import Navbar from "../components/Navbar";

interface SearchResponse {
  developers: {
    id: string; name: string; username: string; avatarUrl: string | null;
    bio: string | null; location: string | null; skills: string[];
  }[];
  page: number;
  pageSize: number;
  total: number;
}

export default function Search() {
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [appliedSkill, setAppliedSkill] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["search", appliedSkill, appliedLocation, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (appliedSkill) params.set("skill", appliedSkill);
      if (appliedLocation) params.set("location", appliedLocation);
      return (await api.get<{ data: SearchResponse }>(`/api/search?${params.toString()}`)).data.data;
    },
  });

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setAppliedSkill(skill);
    setAppliedLocation(location);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-brand-700 dark:text-brand-400 mb-6">Find developers</h1>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill (e.g. React)"
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (e.g. Delhi)"
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-md px-5 py-2"
          >
            Search
          </button>
        </form>

        {isLoading && <p className="text-gray-400 dark:text-gray-500 text-sm">Loading...</p>}

        {data && data.developers.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm">No developers matched those filters.</p>
        )}

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isFetching ? "opacity-60" : ""}`}>
          {data?.developers.map((dev) => (
            <DeveloperCard key={dev.id} dev={dev} />
          ))}
        </div>

        {data && data.total > data.pageSize && (
          <div className="flex items-center justify-center gap-4 mt-8 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-brand-600 dark:text-brand-400 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-gray-400 dark:text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-brand-600 dark:text-brand-400 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
