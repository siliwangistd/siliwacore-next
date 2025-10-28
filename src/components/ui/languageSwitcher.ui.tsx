"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
// 👇 1. Import useParams
import { Link, usePathname } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { SlugMap } from "../layouts/page.layout";

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21l5.25-11.25L21 21m-9-3.75h.008v.008H10.5v-.008zM10.5 7.5v.008h.008v-.008H10.5zm0 3.75h.008v.008H10.5v-.008zm0 3.75h.008v.008H10.5v-.008zm3.75-3.75h.008v.008H14.25v-.008zm0 3.75h.008v.008H14.25v-.008zm0 3.75h.008v.008H14.25v-.008zm3.75-3.75h.008v.008H18v-.008zm0 3.75h.008v.008H18v-.008zm0 3.75h.008v.008H18v-.008zm-9-3.75h.008v.008H9v-.008zm0 3.75h.008v.008H9v-.008zm0 3.75h.008v.008H9v-.008zm-3.75-3.75h.008v.008H5.25v-.008zm0 3.75h.008v.008H5.25v-.008zm0 3.75h.008v.008H5.25v-.008zM3 3l3 3m0 0l3-3m-3 3v12.75A1.5 1.5 0 007.5 21h9a1.5 1.5 0 001.5-1.5V6l-3-3m-12 3l3-3m0 0l3 3m-3-3V3.75A1.5 1.5 0 017.5 2.25h9A1.5 1.5 0 0118 3.75v12.75m-15-3l3-3m0 0l3 3m-3-3v3.75m15-3.75l-3 3m0 0l-3-3m3 3v3.75"
    />
  </svg>
);

const localeConfig = [
  { code: "en", name: "English", short: "EN" },
  { code: "id", name: "Bahasa Indonesia", short: "ID" },
];

export default function LanguageSwitcher({ slugMap }: { slugMap?: SlugMap }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = useLocale();
  const pathname = usePathname(); // This is the canonical path (e.g., "/" or "/services/[slug]")
  const params = useParams(); // 👇 2. Get the current URL params

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const currentLocaleData = localeConfig.find((l) => l.code === currentLocale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <GlobeIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLocaleData?.short}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 ... " role="menu">
          {localeConfig.map((locale) => {
            // --- 👇 NEW LOGIC ---
            let newParams = { ...params };
            let newHref: any = { pathname, params: newParams };

            if (slugMap && params && "slug" in params) {
              // This is a dynamic page with a slug map
              const newSlug = slugMap[locale.code];

              if (newSlug) {
                newParams.slug = newSlug;
                newHref = { pathname, params: newParams };
              } else {
                // Fallback: This locale doesn't have a translation for this page
                // We'll just link to the homepage for that locale
                newHref = { pathname: "/" };
              }
            } else {
              // This is a static page (like homepage) or no map was found
              // The old logic works fine here.
              newHref = { pathname, params: params as any };
            }
            // --- END NEW LOGIC ---

            return (
              <Link
                key={locale.code}
                href={newHref}
                locale={locale.code}
                className={`block px-4 py-2 text-sm ... `}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {locale.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
