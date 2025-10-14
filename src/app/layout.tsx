import { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = (props: RootLayoutProps) => {
  const { children } = props;
  return children;
};

export default RootLayout;
