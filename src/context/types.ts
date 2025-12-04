import type { AuthorPositions, GrantTypes, PublicationTopic } from "../constants/FilterTypes";
import type { PopulationGroup } from "../constants/States";

// filters which don't require data fetch
export interface ClientFilters {
  authorPosition: AuthorPositions;
  minimumCitations: number;
  grantInformation: GrantTypes;
  states: string[];
  populationGroups: PopulationGroup[];
}

// filters which require data fetch
export interface ServerFilters {
  topic: PublicationTopic;
  customKeyword: string;
  yearRange: [number, number];
}

export interface YearlyPublication {
  year: number;
  count: number;
  [key: string]: number;
}

export interface StateYearlyPublication {
  year: number;
  states: { [state: string]: number };
}
[];

export interface totalPublicationsByState {
  state: string;
  count: number;
}
[];

// all types returned by PublicationDataContext
export interface DataState {
  publications: FlattenedPublication[];
  totalPublications: number;
  yearlyData: YearlyPublication[];
  stateYearlyData: StateYearlyPublication[];
  totalPublicationsByState: totalPublicationsByState[];
  loading: boolean;
  progress: Partial<{
    "title.search": number;
    "abstract.search": number;
  }>;
  error: string | null;
}

// processed data entry (for use in table)
export interface FlattenedPublication {
  id: string;
  rowId: string;
  title: string;
  publication_year: number;
  doi: string;
  cited_by_count: number;
  grants: [];
  author_position: string;
  author_name: string;
  institution_name: string;
  institution_ror: string;
  institution_state: string;
}
