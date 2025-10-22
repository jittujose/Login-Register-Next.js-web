import "../styles/global.css";

export const metadata = {
  title: "My Next.js App",
  description: "Using App Router structure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
