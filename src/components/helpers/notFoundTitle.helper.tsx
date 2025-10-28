"use client";

import { useEffect } from "react";

type NotFoundTitleProps = {
  title?: string;
};

const NotFoundTitle = ({ title }: NotFoundTitleProps) => {
  useEffect(() => {
    // As soon as the component loads on the client,
    // manually update the document's title.
    document.title = title ?? "404 Not Found";
  }, [title]);

  // This component renders nothing
  return null;
};

export default NotFoundTitle;
