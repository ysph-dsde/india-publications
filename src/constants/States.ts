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
