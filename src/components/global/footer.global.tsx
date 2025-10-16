import Link from "next/link";
import type { GlobalFooter } from "@/tina/__generated__/types";

type FooterProps = {
  footer: GlobalFooter;
};

export const Footer = ({ footer }: FooterProps) => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-8">
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-2">Social Media</h3>
          <div className="flex gap-4">
            {footer?.socialLinks?.map((social, index) => (
              <a
                key={index}
                href={social?.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                {social?.platform}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Legal</h3>
          <ul className="space-y-1">
            {footer?.legalLinks?.map((legal, index) => (
              <li key={index}>
                <Link href={legal?.link || "#"} className="hover:underline">
                  {legal?.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mx-auto text-center mt-8 border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400">{footer?.copyright}</p>
      </div>
    </footer>
  );
};
