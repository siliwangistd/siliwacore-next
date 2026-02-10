"use client";

import { useTina } from "tinacms/dist/react";
import {
  Exact,
  GlobalFooter,
  GlobalHeader,
  GlobalQuery,
  PageBlocks,
  PageQuery,
  ServiceConnection,
  CaseStudyConnection,
  BlogConnection,
} from "@/tina/__generated__/types";

import Header from "@/components/global/header.global"; // Example component
import Footer from "@/components/global/footer.global"; // Example component
import BlockRenderer from "@/components/layouts/blockRenderer.layout"; // Your component to render blocks

export type SlugMap = { [locale: string]: string };

// Define clear, flattened props
type PageLayoutClientProps = {
  initialPageData: {
    data: PageQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
  initialGlobalData: {
    data: GlobalQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
  initialServicesData?: { data: ServiceConnection | null };
  initialCaseStudiesData?: { data: CaseStudyConnection | null };
  initialBlogsData?: { data: BlogConnection | null };
  initialSlugMap?: SlugMap;
  activeTag?: string;
};

const PageLayout = (props: PageLayoutClientProps) => {
  // Use the hook for both page and global data for a consistent editing experience
  const { data: pageData } = useTina(props.initialPageData);
  const { data: globalData } = useTina(props.initialGlobalData);
  const serviceData = props.initialServicesData;
  const caseStudyData = props.initialCaseStudiesData;
  const blogData = props.initialBlogsData;

  return (
    <>
      {/* Pass live global data to your Header */}
      <Header
        header={globalData.global.header as GlobalHeader}
        slugMap={props.initialSlugMap}
      />

      <main>
        {/* Render your page blocks */}
        {pageData.page.blocks?.filter(Boolean).map((block, i) => (
          // You might still need to cast the type here if TypeScript isn't smart enough
          // to infer the result of filter(Boolean).
          <BlockRenderer
            key={i}
            block={block as PageBlocks}
            services={serviceData}
            caseStudies={caseStudyData}
            blogs={blogData}
            activeTag={props.activeTag}
          />
        ))}
      </main>

      {/* Pass live global data to your Footer */}
      <Footer footer={globalData.global.footer as GlobalFooter} />
    </>
  );
};

export default PageLayout;
