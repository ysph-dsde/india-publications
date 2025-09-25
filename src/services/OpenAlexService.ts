import type { ServerFilters } from "../context/types";
import { parseOpenAlexData } from "../utils/parseData";

export async function* fetchOpenAlexData(
  serverFilters: ServerFilters,
  signal: AbortSignal,
  setProgress: Function,
) {
  const perPage = 200;

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

    let pageIterator = 0;
    let roundedTotal: number | null = null;
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

      // update progress indicators
      if (roundedTotal === null) {
        const count = rawData.meta.count || 0;
        roundedTotal = Math.ceil(count / 200) * 200; // Round up to nearest 200
      }
      pageIterator++;
      const progress =
        roundedTotal > 0
          ? Math.min(((pageIterator * 200) / roundedTotal) * 100, 100)
          : 0;
      setProgress(searchField, progress);

      // Filter out duplicates by id
      const newResults = rawData.results.filter(
        (item: any) => !seenIds.has(item.id),
      );
      newResults.forEach((item: any) => seenIds.add(item.id));
      uniqueResults.push(...newResults);

      // Parse and yield the new results
      if (newResults.length > 0) {
        const parsedData = await parseOpenAlexData({ results: newResults });
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
