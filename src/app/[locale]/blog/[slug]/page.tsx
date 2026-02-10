import { Metadata } from "next";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";

import BlogLayout from "@/src/components/layouts/blog.layout";
import { warn } from "console";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const pageRes = await client.queries.blog({
    relativePath: `${locale}/${slug}.mdx`,
  });

  const page = pageRes.data.blog;

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested content could not be found.",
    };
  }

  const seo = page.seo;
  const pageTitle = seo?.metaTitle || page.title;
  const pageDescription = seo?.metaDescription || "";
  const pageImage = seo?.ogImage || null;

  const keywords =
    seo?.keywords?.filter((k): k is string => typeof k === "string") || [];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },
    alternates: {
      canonical: seo?.canonical || undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  };
}

const BlogPostPage = async (props: BlogPostPageProps) => {
  const { params } = props;
  const { locale, slug } = await params;

  let slugMap, blogRes, globalRes;

  try {
    [blogRes, globalRes] = await Promise.all([
      client.queries.blog({
        relativePath: `${locale}/${slug}.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    const translationKey = blogRes.data.blog.translationKey;
    if (translationKey) {
      slugMap = await createSlugMap("blog", translationKey);
    }

    if (!blogRes.data.blog) {
      notFound();
    }

    return (
      <BlogLayout
        initialBlogData={blogRes}
        initialGlobalData={globalRes}
        initialSlugMap={slugMap}
      />
    );
  } catch (error) {
    warn("Error fetching page or global data:", error);
    notFound();
  }
};

export default BlogPostPage;
