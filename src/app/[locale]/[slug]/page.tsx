import client from "@/tina/__generated__/client";
import PageLayout from "@/components/layouts/page.layout";

type HomePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const HomePage = async (props: HomePageProps) => {
  const { params } = props;
  const { locale, slug } = await params;

  // Fetch both queries at the same time for better performance
  const [pageRes, globalRes] = await Promise.all([
    client.queries.page({
      relativePath: `${locale}/${slug}.mdx`,
    }),
    client.queries.global({
      relativePath: `${locale}/_index.mdx`,
    }),
  ]);

  return <PageLayout initialPageData={pageRes} initialGlobalData={globalRes} />;
};

export default HomePage;
