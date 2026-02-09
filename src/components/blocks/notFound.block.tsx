import Image from "next/image";
import { PageBlocksNotFound } from "@/tina/__generated__/types";
import { Link } from "@/src/i18n/navigation";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

const NotFoundBlock = (props: PageBlocksNotFound) => {
  const { title, description, image, buttonText } = props;

  return (
    <section className="flex flex-col items-center justify-center px-5 py-20 min-h-[60vh] text-center">
      <Image
        src={image || "/uploads/404-image.svg"}
        alt="Page Not Found Illustration"
        width={350}
        height={250}
        className="w-full max-w-[350px] h-auto mb-8"
      />

      <h1
        data-tina-field={tinaField(props, "title")}
        className="text-5xl font-bold text-gray-900"
      >
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        {title || "Page Not Found"}
      </h2>

      <div className="mt-4 max-w-md text-gray-600">
        <TinaMarkdown content={description} />
      </div>

      <Link
        href="/"
        className="mt-8 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        {buttonText || "Go to Homepage"}
      </Link>
    </section>
  );
};

export default NotFoundBlock;
