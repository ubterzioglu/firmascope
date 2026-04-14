import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import TestBanner from "./TestBanner";
import CookieConsentBanner from "./CookieConsentBanner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TestBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};

export default Layout;
