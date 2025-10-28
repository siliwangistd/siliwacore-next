import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PageBlocksHero, ServiceBlocksHero } from "@/tina/__generated__/types";

// This component receives props that match the fields defined in your 'hero' block schema.
const HeroBlock = (props: PageBlocksHero | ServiceBlocksHero) => {
  return (
    <>
      <section className="bg-gray-100 py-20 text-center">
        <div className="container mx-auto px-6">
          <h1
            // Links this H1 to the 'headline' field in TinaCMS
            data-tina-field={tinaField(props, "headline")}
            className="text-5xl font-extrabold text-gray-900"
          >
            {props.headline}
          </h1>
          <div
            // Links this container to the 'subheadline' rich-text field
            data-tina-field={tinaField(props, "subheadline")}
            className="prose prose-lg mx-auto mt-4 text-gray-600"
          >
            {/* Renders the rich-text content from the CMS */}
            <TinaMarkdown content={props.subheadline} />
          </div>
          {props.image && (
            <img
              // Links this image to the 'image' field
              data-tina-field={tinaField(props, "image")}
              src={props.image}
              alt="Hero Image"
              className="mx-auto mt-8 h-auto max-h-96 rounded-lg shadow-md"
            />
          )}
        </div>
      </section>
    </>
  );
};

export default HeroBlock;
