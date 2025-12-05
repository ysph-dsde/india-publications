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

export type AuthorPositions = "First" | "Last" | "First or last" | "Any";

export const AuthorPositionsList: AuthorPositions[] = [
  "First",
  "Last",
  "First or last",
  "Any",
];

export const PublicationTypes = [
  "article",
  "book-chapter",
  "dataset",
  "preprint",
  "dissertation",
  "book",
  "review",
  "paratext",
  "other",
  "libguides",
  "letter",
  "reference-entry",
  "report",
  "peer-review",
  "editorial",
  "erratum",
  "standard",
  "supplementary-materials",
  "retraction",
  "book-section",
  "database",
  "software",
  "report-component",
  "grant",
] as const;
export type PublicationTypes = (typeof PublicationTypes)[number];
