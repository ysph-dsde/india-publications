import type { ServerFilters } from "../context/types";
import { parseOpenAlexData } from "../utils/parseData";

export async function* fetchOpenAlexData(
  serverFilters: ServerFilters,
  signal: AbortSignal,
) {
  const perPage = 200;

  // Fetch the CSV file from the public directory
  const csvResponse = await fetch("/data_ror.csv");
  if (!csvResponse.ok) {
    throw new Error("Failed to fetch data_ror.csv");
  }
  const csvData = await csvResponse.text();

  const baseFilterParams: string[] = [
    "authorships.institutions.country_code:IN",
  ];
  if (serverFilters.yearRange) {
    baseFilterParams.push(
      `from_publication_date:${serverFilters.yearRange[0]}-01-01`,
      `to_publication_date:${serverFilters.yearRange[1]}-12-31`,
    );
  }

  const searchFields = ["title.search", "abstract.search"];
  const seenIds = new Set<string>();
  const uniqueResults: any[] = [];

  const getTopic = (): string => {
    return serverFilters.topic === "Custom Keyword Search"
      ? serverFilters.customKeyword
      : serverFilters.topic;
  };

  for (const searchField of searchFields) {
    let cursor = "*";
    let hasMore = true;

    const filterParams = [...baseFilterParams];
    filterParams.push(`${searchField}:${getTopic()}`);

    const baseQueryParams = new URLSearchParams();
    if (filterParams.length > 0) {
      baseQueryParams.append("filter", filterParams.join(","));
    }
    baseQueryParams.append(
      "select",
      "id,title,publication_year,doi,authorships,cited_by_count,grants",
    );
    baseQueryParams.append("per-page", perPage.toString());

    console.info(
      `https://api.openalex.org/works?${baseQueryParams.toString()}`,
    );

    while (hasMore) {
      const queryParams = new URLSearchParams(baseQueryParams);
      queryParams.append("cursor", cursor);

      const response = await fetch(
        `https://api.openalex.org/works?${queryParams.toString()}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from OpenAlex");
      }

      const rawData = await response.json();

      // Filter out duplicates by id
      const newResults = rawData.results.filter(
        (item: any) => !seenIds.has(item.id),
      );
      newResults.forEach((item: any) => seenIds.add(item.id));
      uniqueResults.push(...newResults);

      // Parse and yield the new results
      if (newResults.length > 0) {
        const parsedData = await parseOpenAlexData(
          { results: newResults },
          csvData,
        );
        yield parsedData;
      }

      // Check if there are more results
      cursor = rawData.meta.next_cursor; // Update cursor for next iteration
      hasMore = cursor !== null && newResults.length > 0;

      // Throttle requests to avoid hitting API rate limits
      // await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
