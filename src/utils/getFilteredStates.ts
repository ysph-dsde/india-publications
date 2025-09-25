import {
  population_states_high,
  population_states_low,
  population_states_medium,
} from "../constants/States";
import type { ClientFilters } from "../context/types";

export const getFilteredStates = (clientFilters: ClientFilters): string[] => {
  const selected: string[] = [];
  if (clientFilters.populationGroups.includes("high"))
    selected.push(...population_states_high);
  if (clientFilters.populationGroups.includes("medium"))
    selected.push(...population_states_medium);
  if (clientFilters.populationGroups.includes("low"))
    selected.push(...population_states_low);
  return selected.sort((a, b) => a.localeCompare(b));
};
