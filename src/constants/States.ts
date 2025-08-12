export const population_states_high = [
  "Uttar Pradesh",
  "Bihar",
  "Maharashtra",
  "West Bengal",
  "Madhya Pradesh",
  "Rajasthan",
  "Tamil Nadu",
  "Gujarat",
];

export const population_states_medium = [
  "Karnataka",
  "Andhra Pradesh",
  "Odisha",
  "Jharkhand",
  "Telangana",
  "Assam",
  "Kerala",
  "Punjab",
  "Haryana",
  "Chhattisgarh",
  "Delhi",
];

export const population_states_low = [
  "Jammu and Kashmir",
  "Uttarakhand",
  "Himachal Pradesh",
  "Tripura",
  "Meghalaya",
  "Manipur",
  "Nagaland",
  "Puducherry",
  "Arunachal Pradesh",
  "Goa",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Mizoram",
  "Chandigarh",
  "Sikkim",
  "Andaman and Nicobar",
  "Ladakh",
  "Lakshadweep",
];

export const States = [
  ...population_states_high,
  ...population_states_medium,
  ...population_states_low,
];

export type PopulationGroup = "high" | "medium" | "low";

export const populationGroupMap: Record<PopulationGroup, string[]> = {
  high: population_states_high,
  medium: population_states_medium,
  low: population_states_low,
};

export const stateColorMapping: { [key: string]: string } = {
  "Andaman and Nicobar": "#4ECDC4",
  "Andhra Pradesh": "#FF6B6B",
  "Arunachal Pradesh": "#F7B733",
  Assam: "#556270",
  Bihar: "#C7F464",
  Chandigarh: "#6C5B7B",
  Chhattisgarh: "#FFB88C",
  Delhi: "#ACD8AA",
  Goa: "#FFA07A",
  Gujarat: "#00A8C6",
  Haryana: "#DCE775",
  "Himachal Pradesh": "#F67280",
  "Jammu and Kashmir": "#8E8D8A",
  Jharkhand: "#FF847C",
  Karnataka: "#2A9D8F",
  Kerala: "#B5B5B5",
  Ladakh: "#FFD166",
  Lakshadweep: "#56CC9D",
  "Madhya Pradesh": "#FF9F1C",
  Maharashtra: "#118AB2",
  Manipur: "#D291BC",
  Meghalaya: "#6A0572",
  Mizoram: "#FFE066",
  Nagaland: "#3F88C5",
  Odisha: "#EF476F",
  Puducherry: "#B5838D",
  Punjab: "#48A9A6",
  Rajasthan: "#9D4EDD",
  Sikkim: "#BFD8B8",
  "Tamil Nadu": "#6DA34D",
  Telangana: "#FAB57A",
  Tripura: "#00B4D8",
  "Uttar Pradesh": "#A29BFE",
  Uttarakhand: "#F4A261",
  "West Bengal": "#D86F45",
};
