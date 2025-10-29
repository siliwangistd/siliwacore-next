import Link from "next/link";
import Image from "next/image";
import type { GlobalHeader } from "@/tina/__generated__/types";
import { useLocale } from "next-intl";
import LanguageSwitcher from "../ui/languageSwitcher.ui";
import { SlugMap } from "../layouts/page.layout";

// The component receives a 'header' object with a specific type from TinaCMS.
type HeaderProps = {
  header: GlobalHeader;
  slugMap?: SlugMap;
};

const Header = ({ header, slugMap }: HeaderProps) => {
  const locale = useLocale();

  return (
    <header className="py-4 px-8 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={`/${locale}`}>
          {/* Use next/image for optimized images */}
          {header?.logo && (
            <Image
              src={header?.logo ?? "#"}
              alt="Company Logo"
              width={150}
              height={40}
              priority // The header logo should load quickly
            />
          )}
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {header?.navLinks?.map((nav, index) => (
            <Link
              key={index}
              href={nav?.link || "#"}
              className="hover:text-blue-500"
            >
              {nav?.label}
            </Link>
          ))}

          {/* Language Switcher */}
          <LanguageSwitcher slugMap={slugMap} />

          {header?.ctaButton?.label && (
            <Link
              href={header.ctaButton.link || "#"}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {header.ctaButton.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
