import { FC, PropsWithChildren } from "react";
import "@/app/ui/globals.css";
import { roboto } from "./ui/fonts";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react"; // Asegúrate de que esta importación esté presente

export const metadata: Metadata = {
  title: {
    template: "%s | SISMED Dashboard",
    default: "SIS-MED"
  },
  description: "Sistema de Gestion Administrativa de SISMED"
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
