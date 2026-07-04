"use client";

import {
  filterProjects,
  getFilterOptions,
  healthLabels,
  projects as allProjects,
  type ProjectHealth,
} from "@/lib/projects-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProjectFiltersState = {
  country: string;
  client: string;
  status: string;
  health: string;
  projectManager: string;
};

type ProjectFiltersProps = {
  filters: ProjectFiltersState;
  onChange: (filters: ProjectFiltersState) => void;
  resultCount: number;
};

const defaultFilters: ProjectFiltersState = {
  country: "all",
  client: "all",
  status: "all",
  health: "all",
  projectManager: "all",
};

export { defaultFilters };

export function ProjectFilters({
  filters,
  onChange,
  resultCount,
}: ProjectFiltersProps) {
  const options = getFilterOptions(allProjects);

  function update(key: keyof ProjectFiltersState, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-white/[0.06] lg:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <p className="shrink-0 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase lg:w-16">
          Filters
        </p>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:gap-3">
          <FilterSelect
            label="Country"
            value={filters.country}
            onValueChange={(value) => update("country", value)}
            options={options.countries}
          />
          <FilterSelect
            label="Client"
            value={filters.client}
            onValueChange={(value) => update("client", value)}
            options={options.clients}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onValueChange={(value) => update("status", value)}
            options={options.statuses}
          />
          <FilterSelect
            label="Health"
            value={filters.health}
            onValueChange={(value) => update("health", value)}
            options={options.healths.map((h) => h as ProjectHealth)}
            formatLabel={(value) => healthLabels[value as ProjectHealth] ?? value}
          />
          <FilterSelect
            label="Project Manager"
            value={filters.projectManager}
            onValueChange={(value) => update("projectManager", value)}
            options={options.projectManagers}
          />
        </div>

        <p className="shrink-0 text-xs tabular-nums text-muted-foreground lg:border-l lg:border-white/[0.06] lg:pl-4">
          {resultCount} project{resultCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  formatLabel,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  formatLabel?: (value: string) => string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next ?? "all")}
    >
      <SelectTrigger className="h-9 w-full min-w-0 border-white/[0.06] bg-white/[0.02] text-sm lg:flex-1">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}s</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {formatLabel ? formatLabel(option) : option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function applyProjectFilters(
  filters: ProjectFiltersState,
  data = allProjects
) {
  return filterProjects(data, filters);
}
