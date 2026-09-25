import "./globals.css";
import { FitLogProvider } from "../components/FitLogProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "FitLog — Workout Library",
  description:
    "Pick a lift, lock it into today’s plan, and watch the week’s work add up.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <FitLogProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </FitLogProvider>
      </body>
    </html>
  );
}
