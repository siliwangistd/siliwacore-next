import { defineConfig } from "tinacms";

// Collections
import pageSchema from "@/tina/schema/page.schema";
import globalSchema from "@/tina/schema/global.schema";
import notFoundSchema from "@/tina/schema/notFound.schema";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },

  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [pageSchema, globalSchema, notFoundSchema],
  },

  cmsCallback: (cms) => {
    cms.events.subscribe("cms:enable", () => {
      // ✅ This check prevents the redirect loop
      if (window.location.pathname.startsWith("/admin")) {
        return; // Do nothing if we are already on an admin page
      }

      const slug = window.location.pathname;
      const url = `/api/draft?secret=${process.env.NEXT_PUBLIC_DRAFT_SECRET_TOKEN}&slug=${slug}`;
      window.location.href = url;
    });

    cms.events.subscribe("cms:disable", () => {
      const slug = window.location.pathname;
      const url = `/api/exit-draft?slug=${slug}`;
      window.location.href = url;
    });

    return cms;
  },
});
