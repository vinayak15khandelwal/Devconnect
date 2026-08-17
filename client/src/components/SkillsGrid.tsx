import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface SkillItem {
  id: string;
  name: string;
  endorsementCount: number;
  endorsedByMe: boolean;
}

// Skills arrive pre-sorted by endorsementCount (highest first) from the API,
// so the leader is naturally the profile's "top skill" — flagged with a badge
// rather than building a separate leaderboard for a single-profile view.
export default function SkillsGrid({
  skills, username, canEndorse,
}: {
  skills: SkillItem[];
  username: string;
  canEndorse: boolean;
}) {
  const queryClient = useQueryClient();

  const endorse = useMutation({
    mutationFn: (skillName: string) => api.post(`/api/endorsements/${username}/${encodeURIComponent(skillName)}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", username] }),
  });

  if (skills.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-500">No skills added yet.</p>;
  }

  const topCount = skills[0]?.endorsementCount ?? 0;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <div
          key={skill.id}
          className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-medium px-3 py-1.5 rounded-full"
        >
          {i === 0 && topCount > 0 && <span title="Most-endorsed skill">🏆</span>}
          {skill.name}
          {skill.endorsementCount > 0 && (
            <span className="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {skill.endorsementCount}
            </span>
          )}
          {canEndorse && !skill.endorsedByMe && (
            <button
              onClick={() => endorse.mutate(skill.name)}
              disabled={endorse.isPending}
              title="Endorse this skill"
              className="text-brand-500 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:opacity-50 font-bold px-1.5 py-1 -my-1 -mr-1"
            >
              +
            </button>
          )}
          {canEndorse && skill.endorsedByMe && <span className="text-brand-400" title="You endorsed this">✓</span>}
        </div>
      ))}
    </div>
  );
}
