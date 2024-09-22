"use client";
import { LayoutProvider } from "@/layout/context/layoutcontext";
import "../styles/layout/layout.scss";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
