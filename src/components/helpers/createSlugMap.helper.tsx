import client from "@/tina/__generated__/client";
import { SlugMap } from "../layouts/page.layout";

const createSlugMap = async (
  collection: string,
  translationKey: string,
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
      `createSlugMap: Error fetching pageConnection for key="${translationKey}". ${e.message}`,
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
    console.log(e);
  }

  try {
    const caseStudies = await client.queries.caseStudyConnection({
      filter: { translationKey: { eq: translationKey } },
    });
    caseStudies?.data?.caseStudyConnection?.edges?.forEach((edge) => {
      if (edge?.node) {
        const locale = edge.node._sys.breadcrumbs[0];
        slugMap[locale] = edge.node._sys.filename;
      }
    });
  } catch (e) {
    /* ignore */
    console.log(e);
  }

  try {
    const blogs = await client.queries.blogConnection({
      filter: { translationKey: { eq: translationKey } },
    });
    blogs?.data?.blogConnection?.edges?.forEach((edge) => {
      if (edge?.node) {
        const locale = edge.node._sys.breadcrumbs[0];
        slugMap[locale] = edge.node._sys.filename;
      }
    });
  } catch (e) {
    /* ignore */
    console.log(e);
  }

  return slugMap;
};

export default createSlugMap;
