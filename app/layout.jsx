import "./globals.css";

export const metadata = {
  title: "For Kasturi | Birthday Book",
  description: "A private birthday love book for Kasturi."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
