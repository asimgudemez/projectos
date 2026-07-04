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
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Filters
        </p>
        <p className="text-xs text-muted-foreground">
          {resultCount} project{resultCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
      <SelectTrigger className="h-9 w-full border-white/[0.06] bg-white/[0.02] text-sm">
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
