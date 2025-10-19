import client from "@/tina/__generated__/client";
import { getLocale } from "next-intl/server";

import NotFoundLayout from "@/components/layouts/notFound.layout";

const NotFoundPage = async () => {
  const locale = await getLocale();

  const [notFoundRes, globalRes] = await Promise.all([
    client.queries.notFound({
      relativePath: `${locale}/_index.mdx`,
    }),
    client.queries.global({
      relativePath: `${locale}/_index.mdx`,
    }),
  ]);

  return (
    <NotFoundLayout
      initialNotFoundData={notFoundRes}
      initialGlobalData={globalRes}
    />
  );
};

export default NotFoundPage;
