import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "bmad-poc",
  description: "Scaffolded frontend for the bmad-poc outfit recommendation MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
