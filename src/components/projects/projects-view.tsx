"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { projects as allProjects } from "@/lib/projects-data";
import { Button } from "@/components/ui/button";
import {
  applyProjectFilters,
  defaultFilters,
  ProjectFilters,
  type ProjectFiltersState,
} from "@/components/projects/project-filters";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectKpis } from "@/components/projects/project-kpis";

export function ProjectsView() {
  const [filters, setFilters] = useState<ProjectFiltersState>(defaultFilters);

  const filteredProjects = useMemo(
    () => applyProjectFilters(filters),
    [filters]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Portfolio
          </p>
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Company-wide construction portfolio
          </p>
        </div>

        <Button
          className="h-9 shrink-0 bg-violet-600 text-white hover:bg-violet-500"
        >
          <Plus className="size-4" data-icon="inline-start" />
          New Project
        </Button>
      </div>

      <ProjectKpis projects={allProjects} />

      <ProjectFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filteredProjects.length}
      />

      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/[0.08] px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            No projects match these filters
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Adjust your filters to see more of the portfolio.
          </p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setFilters(defaultFilters)}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
