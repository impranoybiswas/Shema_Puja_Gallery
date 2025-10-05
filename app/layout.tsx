import type { Metadata } from "next";
import "./globals.css";
import CustomLayout from "./components/CustomLayout";

export const metadata: Metadata = {
  title: "Shema Puja Gellary",
  description: "Puja Vibe With Special Kali Puja Gellary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CustomLayout>{children}</CustomLayout>
      </body>
    </html>
  );
}
