import client from "@/tina/__generated__/client";
import { SlugMap } from "../layouts/page.layout";

const createSlugMap = async (
  collection: string,
  translationKey: string
): Promise<SlugMap> => {
  const slugMap: SlugMap = {};

  try {
    const pages = await client.queries.pageConnection({
      filter: { translationKey: { eq: translationKey } },
    });
    pages?.data?.pageConnection?.edges?.forEach((edge) => {
      if (edge?.node) {
        const locale = edge.node._sys.breadcrumbs[0];
        slugMap[locale] = edge.node._sys.filename;
      }
    });
  } catch (e: any) {
    console.warn(
      `createSlugMap: Error fetching pageConnection for key="${translationKey}". ${e.message}`
    );
  }

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
    console.warn(
      `createSlugMap: Error fetching serviceConnection for translationKey=${translationKey}: `
    );
  }

  // ... (add a similar try/catch for blogConnection if needed)

  return slugMap;
};

export default createSlugMap;
