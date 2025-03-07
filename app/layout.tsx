import {FC, PropsWithChildren} from "react";
import "@/app/ui/globals.css";
import { roboto } from "./ui/fonts";
import { Metadata } from "next";

// titulo y descripcion de mi pagina web 
export const metadata: Metadata = {
  title: {
    template: "%s | SisMEd Dashboard",
    default: "SisMEd Dashboard",
  }, 
  description: "Sistema Medico.", 
};
  
const RootLayout: FC<PropsWithChildren> = ({children}) => {
  return (
    <html>
      <body className={`${roboto.className} antialiased`}>{children}</body>

    </html>
  );
};
export default RootLayout;