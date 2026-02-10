import type { Metadata } from "next";
import client from "@/tina/__generated__/client";

import PageLayout from "@/components/layouts/page.layout";
import { BlogConnection } from "@/tina/__generated__/types";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";
import { warn } from "console";

type BlogTagPageProps = {
  params: Promise<{ locale: string; tag: string }>;
};

export async function generateMetadata({
  params,
}: BlogTagPageProps): Promise<Metadata> {
  const { locale, tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const pageRes = await client.queries.page({
    relativePath: `${locale}/_blog.mdx`,
  });

  const page = pageRes.data.page;

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested content could not be found.",
    };
  }

  const seo = page.seo;
  const pageTitle = `${decodedTag} - ${seo?.metaTitle || page.title}`;
  const pageDescription = seo?.metaDescription || "";

  return {
    title: pageTitle,
    description: pageDescription,
  };
}

const BlogTagPage = async (props: BlogTagPageProps) => {
  const { locale, tag } = await props.params;
  const decodedTag = decodeURIComponent(tag);

  let pageRes, globalRes, slugMap;

  try {
    [pageRes, globalRes] = await Promise.all([
      client.queries.page({
        relativePath: `${locale}/_blog.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    const translationKey = pageRes.data.page.translationKey;
    if (translationKey) {
      slugMap = await createSlugMap("page", translationKey);
    }

    const hasBlogList = pageRes.data.page.blocks?.some(
      (block) => block?.__typename === "PageBlocksBlogList",
    );

    const blogPromise = hasBlogList
      ? client.queries.blogConnection({
          filter: {
            draft: {
              eq: false,
            },
          },
        })
      : Promise.resolve({ data: null });

    const [blogRes] = await Promise.all([blogPromise]);

    const filteredBlogEdges = (
      blogRes?.data?.blogConnection?.edges || []
    ).filter((edge) =>
      edge?.node?._sys.path.startsWith(`src/content/blog/${locale}/`),
    );

    return (
      <PageLayout
        initialPageData={pageRes}
        initialGlobalData={globalRes}
        initialBlogsData={{
          data: {
            ...blogRes?.data?.blogConnection,
            edges: filteredBlogEdges,
          } as BlogConnection,
        }}
        initialSlugMap={slugMap}
        activeTag={decodedTag}
      />
    );
  } catch (error) {
    warn("Error fetching data for BlogTagPage:", error);
    return null;
  }
};

export default BlogTagPage;
