import type {
  PageBlocksServiceList,
  ServiceConnection,
} from "@/tina/__generated__/types";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type ServiceListBlockProps = {
  services?: { data: ServiceConnection | null };
} & PageBlocksServiceList;

const ServiceListBlock = (props: ServiceListBlockProps) => {
  const { title, subheadline, services } = props;
  const data = services?.data;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        {title && (
          <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>
        )}
        {subheadline && (
          <div className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            <TinaMarkdown content={subheadline} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!data || data.edges?.length === 0 ? (
            <p className="text-gray-500">No services found.</p>
          ) : (
            data.edges?.map((serviceEdge) => {
              // Ensure the node exists before trying to render
              if (!serviceEdge?.node) {
                return null;
              }

              const service = serviceEdge.node;
              const slug = service._sys.filename;
              const locale = service._sys.breadcrumbs[0];

              return (
                <Link
                  key={service.id}
                  href={{
                    pathname: "/services/[slug]",
                    params: { slug },
                  }}
                  className="block p-6 bg-white rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow duration-300"
                  locale={locale}
                >
                  {service.icon && (
                    <Image
                      src={service.icon}
                      alt={`${service.title} icon`}
                      width={48}
                      height={48}
                      className="mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.excerpt}</p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceListBlock;
