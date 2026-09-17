import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Briefing de criação de site",
  description: "Conte para a gente sobre o seu projeto de site.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
