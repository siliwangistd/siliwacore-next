import { tinaField } from "tinacms/dist/react";
import {
  PageBlocksFeatureList,
  ServiceBlocksFeatureList,
} from "@/tina/__generated__/types";
import Image from "next/image";

// This component receives props that match the 'featureList' block schema.
const FeatureBlock = (
  props: PageBlocksFeatureList | ServiceBlocksFeatureList
) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2
          // Links the <h2> to the top-level 'title' field in the CMS.
          data-tina-field={tinaField(props, "title")}
          className="mb-12 text-4xl font-bold text-gray-900"
        >
          {props.title}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* We safely map over the 'features' array to render each one. */}
          {props.features?.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg"
            >
              {feature?.icon && (
                <Image
                  // Links this <img> to the 'icon' field within a specific feature item.
                  data-tina-field={tinaField(feature, "icon")}
                  src={feature.icon}
                  width={64}
                  height={64}
                  alt=""
                  className="mb-4 h-16 w-16"
                />
              )}
              <h3
                // Links this <h3> to the 'title' field within a specific feature item.
                data-tina-field={tinaField(feature, "title")}
                className="mb-2 text-2xl font-semibold text-gray-900"
              >
                {feature?.title}
              </h3>
              <p
                // Links this <p> to the 'description' field within a specific feature item.
                data-tina-field={tinaField(feature, "description")}
                className="text-gray-600"
              >
                {feature?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBlock;
