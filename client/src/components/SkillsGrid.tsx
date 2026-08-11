interface SkillItem {
  id: string;
  name: string;
  endorsementCount: number;
}

// Read-only grid of skill pills with endorsement counts. Endorsing someone
// else's skill (which requires a connection) is wired up on Day 10.
export default function SkillsGrid({ skills }: { skills: SkillItem[] }) {
  if (skills.length === 0) {
    return <p className="text-sm text-gray-400">No skills added yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full"
        >
          {skill.name}
          {skill.endorsementCount > 0 && (
            <span className="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {skill.endorsementCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
