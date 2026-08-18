import { memo } from "react";
import type { Project } from "@shared/index";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 hover:shadow-sm transition">
      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.title} className="w-full h-36 object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{project.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-3 text-sm">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
              Repo
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ProjectCard);
