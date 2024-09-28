"use client";
import { LayoutProvider } from "@/layout/context/layoutcontext";
import "../styles/layout/layout.scss";
import "drjicons/primeicons.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          id="theme-css"
          href={`/themes/light-indigo/theme.css`}
          rel="stylesheet"
        />
      </head>
      <body>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
