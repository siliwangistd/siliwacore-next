import client from "@/tina/__generated__/client";
import { SlugMap } from "../layouts/page.layout";

const createSlugMap = async (
  collection: string,
  translationKey: string
): Promise<SlugMap> => {
  const slugMap: SlugMap = {};

  // We must query for both collections.
  // A full app would generalize this, but for now this is explicit.
  try {
    const services = await client.queries.serviceConnection({
      filter: { translationKey: { eq: translationKey } },
    });
    services?.data?.serviceConnection?.edges?.forEach((edge) => {
      if (edge?.node) {
        const locale = edge.node._sys.breadcrumbs[0];
        slugMap[locale] = edge.node._sys.filename;
      }
    });
  } catch (e) {
    /* ignore */
  }

  // ... (add a similar try/catch for blogConnection if needed)

  return slugMap;
};

export default createSlugMap;
