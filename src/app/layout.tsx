import { ReactNode } from "react";
import "../../styles/globals.css";

const RootLayout = async ({ children }: { children: ReactNode }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
    </head>
    <body>{children}</body>
  </html>
);

export default RootLayout;
