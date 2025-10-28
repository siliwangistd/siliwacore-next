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

  const serviceRes = await client.queries.service({
    relativePath: `${locale}/${slug}.mdx`,
  });

  const service = serviceRes.data.service;

  return {
    title: service.seo?.metaTitle || service.title,
    description: service.seo?.metaDescription,
    openGraph: {
      title: service.seo?.metaTitle || service.title,
      description: service.seo?.metaDescription || "",
      images: service.seo?.ogImage ? [service.seo.ogImage] : [],
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
