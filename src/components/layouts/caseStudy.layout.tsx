"use client";

import { useTina } from "tinacms/dist/react";
import {
  Exact,
  GlobalFooter,
  GlobalHeader,
  GlobalQuery,
  CaseStudyBlocks,
  CaseStudyQuery,
} from "@/tina/__generated__/types";

import Header from "@/components/global/header.global";
import Footer from "@/components/global/footer.global";
import BlockRenderer from "@/components/layouts/blockRenderer.layout";

export type SlugMap = { [locale: string]: string };

type CaseStudyLayoutClientProps = {
  initialCaseStudyData: {
    data: CaseStudyQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
  initialGlobalData: {
    data: GlobalQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
  initialSlugMap?: SlugMap;
};

const CaseStudyLayout = (props: CaseStudyLayoutClientProps) => {
  const { data: caseStudyData } = useTina(props.initialCaseStudyData);
  const { data: globalData } = useTina(props.initialGlobalData);

  return (
    <>
      <Header
        header={globalData.global.header as GlobalHeader}
        slugMap={props.initialSlugMap}
      />

      <main>
        {caseStudyData.caseStudy.blocks?.filter(Boolean).map((block, i) => (
          <BlockRenderer key={i} block={block as CaseStudyBlocks} />
        ))}
      </main>

      <Footer footer={globalData.global.footer as GlobalFooter} />
    </>
  );
};

export default CaseStudyLayout;
