"use client";

import { useTina } from "tinacms/dist/react";
import {
  Exact,
  GlobalFooter,
  GlobalHeader,
  GlobalQuery,
  BlogBlocks,
  BlogQuery,
} from "@/tina/__generated__/types";

import Header from "@/components/global/header.global";
import Footer from "@/components/global/footer.global";
import BlockRenderer from "@/components/layouts/blockRenderer.layout";

export type SlugMap = { [locale: string]: string };

type BlogLayoutClientProps = {
  initialBlogData: {
    data: BlogQuery;
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

const BlogLayout = (props: BlogLayoutClientProps) => {
  const { data: blogData } = useTina(props.initialBlogData);
  const { data: globalData } = useTina(props.initialGlobalData);

  return (
    <>
      <Header
        header={globalData.global.header as GlobalHeader}
        slugMap={props.initialSlugMap}
      />

      <main>
        {blogData.blog.blocks?.filter(Boolean).map((block, i) => (
          <BlockRenderer key={i} block={block as BlogBlocks} />
        ))}
      </main>

      <Footer footer={globalData.global.footer as GlobalFooter} />
    </>
  );
};

export default BlogLayout;
