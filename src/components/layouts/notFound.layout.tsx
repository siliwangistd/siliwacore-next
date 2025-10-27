"use client";

import { useTina } from "tinacms/dist/react";
import {
  Exact,
  GlobalFooter,
  GlobalHeader,
  GlobalQuery,
  NotFoundQuery,
} from "@/tina/__generated__/types";

import NotFoundTitle from "@/components/helpers/NotFoundTitle.helper";

// Components for global header and footer
import Header from "@/components/global/header.global";
import Footer from "@/components/global/footer.global";
import { Link } from "@/src/i18n/routing";
import Image from "next/image";

// Define clear, flattened props
type NotFoundLayoutProps = {
  initialNotFoundData: {
    data: NotFoundQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
  initialGlobalData: {
    data: GlobalQuery;
    variables: Exact<{ relativePath: string }>;
    query: string;
  };
};

const NotFoundLayout = (props: NotFoundLayoutProps) => {
  // Use the hook for both page and global data for a consistent editing experience
  const { data: notFoundData } = useTina(props.initialNotFoundData);
  const { data: globalData } = useTina(props.initialGlobalData);

  const pageTitle = `${notFoundData.notFound.title || "Page Not Found"} - ${
    globalData.global.siteInfo?.siteName || "Siliwacore"
  }`;

  return (
    <>
      {/* Set the document title */}
      <NotFoundTitle title={pageTitle} />

      {/* Pass live global data to your Header */}
      <Header header={globalData.global.header as GlobalHeader} />

      <main>
        <div className="flex flex-col items-center justify-center px-5 py-20 min-h-[60vh] text-center">
          <Image
            src={notFoundData.notFound.image || "/uploads/404-image.svg"}
            alt="Page Not Found Illustration"
            width={350}
            height={250}
            className="w-full max-w-[350px] h-auto mb-8"
          />

          <h1 className="text-5xl font-bold text-gray-900">404</h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {notFoundData.notFound.title || "Page Not Found"}
          </h2>

          <p className="mt-4 max-w-md text-gray-600">
            {notFoundData.notFound.description ||
              "Sorry, we couldn't find the page you're looking for."}
          </p>

          <Link
            href="/"
            className="mt-8 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            {notFoundData.notFound.buttonText || "Go to Homepage"}
          </Link>
        </div>
      </main>

      {/* Pass live global data to your Footer */}
      <Footer footer={globalData.global.footer as GlobalFooter} />
    </>
  );
};

export default NotFoundLayout;
