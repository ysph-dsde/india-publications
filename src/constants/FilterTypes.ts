export const PublicationTopics = [
  "Electronic Health Records",
  "Genome-Wide Association Studies",
  "Artificial Intelligence",
  "Digital Health",
  "COVID-19",
  "Development Economics",
  "International Trade",
  "Public Finance",
  "Macroeconomics",
  "Game Theory",
  "Environmental Science",
  "Custom Keyword Search",
] as const;
export type PublicationTopic = (typeof PublicationTopics)[number];

export type AuthorPositions = "First" | "First and last" | "Any";

export const AuthorPositionsList: AuthorPositions[] = [
  "First",
  "First and last",
  "Any",
];

export type GrantTypes = "Yes" | "No" | "Any";

export const GrantTypesList: GrantTypes[] = ["Yes", "No", "Any"];
