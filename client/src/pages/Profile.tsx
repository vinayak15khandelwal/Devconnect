import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SkillsGrid from "../components/SkillsGrid";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "@shared/index";

interface DeveloperProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  githubUrl: string | null;
  skills: { id: string; name: string; endorsementCount: number }[];
  projects: Project[];
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [addingProject, setAddingProject] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => (await api.get<{ data: DeveloperProfile }>(`/api/profile/${username}`)).data.data,
    enabled: !!username,
  });

  const updateProfile = useMutation({
    mutationFn: (payload: { bio?: string; location?: string; githubUrl?: string; skills?: string[] }) =>
      api.patch("/api/profile", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      setEditing(false);
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("avatar", file);
      return api.post("/api/profile/avatar", form, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", username] }),
  });

  const addProject = useMutation({
    mutationFn: (payload: { title: string; description: string; techStack: string[] }) => {
      const form = new FormData();
      form.append("title", payload.title);
      form.append("description", payload.description);
      form.append("techStack", JSON.stringify(payload.techStack));
      return api.post("/api/projects", form, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      setAddingProject(false);
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (error || !profile)
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Developer not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-start gap-5">
          <div className="relative">
            <img
              src={profile.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${profile.name}`}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover bg-gray-100"
            />
            {isOwnProfile && (
              <label className="absolute -bottom-1 -right-1 bg-brand-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                +
                <input
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadAvatar.mutate(e.target.files[0])}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-sm text-gray-400">@{profile.username}</p>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setEditing((v) => !v)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                >
                  {editing ? "Cancel" : "Edit profile"}
                </button>
              )}
            </div>

            {!editing ? (
              <>
                {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                      GitHub
                    </a>
                  )}
                </div>
              </>
            ) : (
              <EditForm
                initial={profile}
                submitting={updateProfile.isPending}
                onSubmit={(payload) => updateProfile.mutate(payload)}
              />
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
          <SkillsGrid skills={profile.skills} />
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Projects</h2>
            {isOwnProfile && (
              <button
                onClick={() => setAddingProject((v) => !v)}
                className="text-sm text-brand-600 hover:underline"
              >
                {addingProject ? "Cancel" : "+ Add project"}
              </button>
            )}
          </div>

          {addingProject && (
            <AddProjectForm submitting={addProject.isPending} onSubmit={(payload) => addProject.mutate(payload)} />
          )}

          {profile.projects.length === 0 ? (
            <p className="text-sm text-gray-400">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditForm({
  initial, submitting, onSubmit,
}: {
  initial: DeveloperProfile;
  submitting: boolean;
  onSubmit: (payload: { bio?: string; location?: string; githubUrl?: string; skills?: string[] }) => void;
}) {
  const [bio, setBio] = useState(initial.bio || "");
  const [location, setLocation] = useState(initial.location || "");
  const [githubUrl, setGithubUrl] = useState(initial.githubUrl || "");
  const [skillsInput, setSkillsInput] = useState(initial.skills.map((s) => s.name).join(", "));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      bio, location, githubUrl,
      skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <textarea
        value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} rows={2}
        placeholder="A short bio"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="GitHub URL"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <input
        value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)}
        placeholder="Skills, comma separated (e.g. React, Node.js, PostgreSQL)"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button
        type="submit" disabled={submitting}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md px-4 py-2"
      >
        {submitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

function AddProjectForm({
  submitting, onSubmit,
}: {
  submitting: boolean;
  onSubmit: (payload: { title: string; description: string; techStack: string[] }) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ title, description, techStack: techStack.split(",").map((t) => t.trim()).filter(Boolean) });
    setTitle(""); setDescription(""); setTechStack("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2 bg-gray-50 rounded-lg p-4">
      <input
        required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <textarea
        required value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
        placeholder="Short description"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <input
        required value={techStack} onChange={(e) => setTechStack(e.target.value)}
        placeholder="Tech stack, comma separated (e.g. React, Express)"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button
        type="submit" disabled={submitting}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md px-4 py-2"
      >
        {submitting ? "Adding..." : "Add project"}
      </button>
    </form>
  );
}
