import { useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "firmascope-test-banner-closed-v1";

const TestBanner = () => {
  const [hidden, setHidden] = useState(
    typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1"
  );

  const closeBanner = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setHidden(true);
  };

  return (
    <>
      {!hidden && <div className="h-9" aria-hidden="true" />}
      {!hidden && (
        <div className="fixed inset-x-0 top-0 z-[60] bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-center">
            <p>firmascope test yayininda! devami cok yakinda!</p>
            <button
              type="button"
              onClick={closeBanner}
              className="absolute right-3 rounded p-1 text-white/90 transition hover:bg-white/20 hover:text-white"
              aria-label="Test bannerini kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TestBanner;
