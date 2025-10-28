"use client";

import { useTina } from "tinacms/dist/react";
import {
  Exact,
  GlobalFooter,
  GlobalHeader,
  GlobalQuery,
  PageBlocks,
  ServiceBlocks,
  ServiceQuery,
} from "@/tina/__generated__/types";

import Header from "@/components/global/header.global"; // Example component
import Footer from "@/components/global/footer.global"; // Example component
import BlockRenderer from "@/components/layouts/blockRenderer.layout"; // Your component to render blocks

// Define clear, flattened props
type ServiceLayoutClientProps = {
  initialServiceData: {
    data: ServiceQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
  initialGlobalData: {
    data: GlobalQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
};

const ServiceLayout = (props: ServiceLayoutClientProps) => {
  // Use the hook for both service and global data for a consistent editing experience
  const { data: serviceData } = useTina(props.initialServiceData);
  const { data: globalData } = useTina(props.initialGlobalData);

  console.log("Rendering ServiceLayout with serviceData:", serviceData);

  return (
    <>
      {/* Pass live global data to your Header */}
      <Header header={globalData.global.header as GlobalHeader} />

      <main>
        {/* Render your service blocks */}
        {serviceData.service.blocks?.filter(Boolean).map((block, i) => (
          // You might still need to cast the type here if TypeScript isn't smart enough
          // to infer the result of filter(Boolean).
          <BlockRenderer key={i} block={block as ServiceBlocks} />
        ))}
      </main>

      {/* Pass live global data to your Footer */}
      <Footer footer={globalData.global.footer as GlobalFooter} />
    </>
  );
};

export default ServiceLayout;
