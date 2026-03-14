import type { Metadata } from "next";
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: "Vision — Community Incident Report",
  description: "Real-time community-driven incident reporting platform for Jamaica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
