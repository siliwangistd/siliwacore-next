import { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "SiliwaCore",
  description: "The core of Siliwa",
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = (props: RootLayoutProps) => {
  const { children } = props;
  return children;
};

export default RootLayout;
