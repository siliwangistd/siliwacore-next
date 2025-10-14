import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  // `getTranslations` is used to get translations in Server Components.
  // You pass the "namespace" from your JSON file (e.g., "HomePage").
  const t = await getTranslations("HomePage");

  return (
    <main>
      <h1>{t("title")}</h1>
    </main>
  );
}
