import { Metadata } from "next";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";

import ServiceLayout from "@/src/components/layouts/service.layout";
import { warn } from "console";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";

type ServicePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const pageRes = await client.queries.page({
    relativePath: `${locale}/${slug}.mdx`,
  });

  // Safely get data. `page` might be undefined if not found.
  const page = pageRes.data.page;

  // A good fallback for SEO if the page data is missing.
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
    // --- Main Meta ---
    title: page.seo?.metaTitle || page.title,
    description: pageDescription,
    keywords: keywords,

    // --- Open Graph (for social sharing) ---
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },

    // --- Twitter Card ---
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },

    // --- Other SEO Fields ---
    alternates: {
      canonical: seo?.canonical || undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  };
}

const ServicePage = async (props: ServicePageProps) => {
  const { params } = props;
  const { locale, slug } = await params;

  let slugMap, serviceRes, globalRes;

  try {
    // Fetch both queries at the same time for better performance
    [serviceRes, globalRes] = await Promise.all([
      client.queries.service({
        relativePath: `${locale}/${slug}.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    const translationKey = serviceRes.data.service.translationKey;
    if (translationKey) {
      slugMap = await createSlugMap("service", translationKey);
    }

    if (!serviceRes.data.service) {
      notFound(); // 👈 Trigger 404 if no page data
    }

    return (
      <ServiceLayout
        initialServiceData={serviceRes}
        initialGlobalData={globalRes}
        initialSlugMap={slugMap}
      />
    );
  } catch (error) {
    warn("Error fetching page or global data:", error);
    notFound(); // 👈 Trigger 404 on any fetch error
  }
};

export default ServicePage;
