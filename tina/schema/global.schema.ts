import { Collection } from "tinacms";

const globalSchema: Collection = {
  name: "global",
  label: "Globals",
  path: "src/content/global",
  format: "mdx",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    global: true,
  },
  fields: [
    {
      name: "siteInfo",
      label: "Site Information",
      type: "object",
      fields: [
        {
          type: "string",
          name: "siteName",
          label: "Site Name",
          description: "The official name of the brand (e.g., Siliwacore).",
          required: true,
        },
        {
          type: "string",
          name: "siteTagline",
          label: "Site Tagline",
          description: "A short, catchy phrase for SEO and branding.",
        },
        {
          type: "string",
          name: "companyEmail",
          label: "Contact Email",
        },
        {
          type: "string",
          name: "companyPhone",
          label: "Contact Phone",
        },
      ],
    },
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
          ui: {
            itemProps: (item: any) => {
              return { label: item.label };
            },
          },
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
          ui: {
            itemProps: (item: any) => {
              return { label: item.platform };
            },
          },
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
          ui: {
            itemProps: (item: any) => {
              return { label: item.label };
            },
          },
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
