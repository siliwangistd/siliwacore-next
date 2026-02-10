import type {
  PageBlocksCaseStudyList,
  CaseStudyConnection,
} from "@/tina/__generated__/types";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type CaseStudyListBlockProps = {
  caseStudies?: { data: CaseStudyConnection | null };
} & PageBlocksCaseStudyList;

const CaseStudyListBlock = (props: CaseStudyListBlockProps) => {
  const { title, subheadline, caseStudies } = props;
  const data = caseStudies?.data;

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
            <p className="text-gray-500">No case studies found.</p>
          ) : (
            data.edges?.map((edge) => {
              if (!edge?.node) {
                return null;
              }

              const caseStudy = edge.node;
              const slug = caseStudy._sys.filename;
              const locale = caseStudy._sys.breadcrumbs[0];

              return (
                <Link
                  key={caseStudy.id}
                  href={{
                    pathname: "/case-studies/[slug]",
                    params: { slug },
                  }}
                  className="block p-6 bg-white rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow duration-300"
                  locale={locale}
                >
                  {caseStudy.coverImage && (
                    <Image
                      src={caseStudy.coverImage}
                      alt={`${caseStudy.title} cover`}
                      width={400}
                      height={225}
                      className="mb-4 rounded-md w-full h-48 object-cover"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {caseStudy.title}
                  </h3>
                  {caseStudy.client && (
                    <p className="text-sm text-blue-600 mb-1">
                      {caseStudy.client}
                    </p>
                  )}
                  <p className="text-gray-600">{caseStudy.excerpt}</p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyListBlock;
