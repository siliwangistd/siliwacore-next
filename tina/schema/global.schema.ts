import { Collection } from "tinacms";
// If you create reusable field groups, you can import them like this:
// import { buttonFields } from "../fields/button";

const globalSchema: Collection = {
  name: "global",
  label: "Globals",
  // We point to a single file in the content directory
  path: "src/content/global",
  format: "mdx",
  // This tells TinaCMS that this is a single-file collection.
  // It prevents editors from creating or deleting documents in this collection.
  ui: {
    allowedActions: {
      create: true,
      delete: true,
    },
    global: true,
  },
  fields: [
    // We group fields into objects for better organization in the UI
    {
      name: "header",
      label: "Header Settings",
      type: "object",
      fields: [
        {
          name: "logo",
          label: "Logo",
          type: "image",
        },
        {
          name: "navLinks",
          label: "Navigation Links",
          type: "object",
          list: true,
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "link",
              label: "Link",
              type: "string",
            },
          ],
        },
        {
          name: "ctaButton",
          label: "Call-to-Action Button",
          type: "object",
          fields: [
            // This is a great place to use a reusable field group
            // ...buttonFields
            {
              name: "label",
              label: "Button Label",
              type: "string",
            },
            {
              name: "link",
              label: "Button Link",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "footer",
      label: "Footer Settings",
      type: "object",
      fields: [
        {
          name: "socialLinks",
          label: "Social Media Links",
          type: "object",
          list: true,
          fields: [
            {
              name: "platform",
              label: "Platform",
              type: "string",
              options: ["Facebook", "Twitter", "Instagram", "LinkedIn"],
            },
            {
              name: "url",
              label: "URL",
              type: "string",
            },
          ],
        },
        {
          name: "legalLinks",
          label: "Legal Links",
          type: "object",
          list: true,
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "link",
              label: "Link",
              type: "string",
            },
          ],
        },
        {
          name: "copyright",
          label: "Copyright Text",
          type: "string",
        },
      ],
    },
  ],
};

export default globalSchema;
