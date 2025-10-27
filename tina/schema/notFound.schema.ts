import { Collection } from "tinacms";

const notFoundSchema: Collection = {
  name: "notFound",
  label: "404 Page",
  path: "src/content/notFound", // Content will be stored here
  format: "mdx", // Using MDX format as requested
  ui: {
    // This prevents editors from creating/deleting the essential 404 files
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    // All content will be stored in the MDX frontmatter
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
      description: "The main headline (e.g., 'Page Not Found').",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      ui: {
        component: "textarea",
      },
      description: "The helpful text explaining what happened.",
    },
    {
      type: "string",
      name: "buttonText",
      label: "Button Text",
      description:
        "The text for the button that links back to the homepage (e.g., 'Return Home').",
    },
    {
      type: "image",
      name: "image",
      label: "Optional Image",
      description: "An optional image to display on the page.",
    },
  ],
};

export default notFoundSchema;
