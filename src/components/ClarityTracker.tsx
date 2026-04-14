import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  applyClarityConsent,
  initClarity,
  readClarityConsent,
  setClarityTag,
} from "@/lib/clarity";

const ClarityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initClarity();

    const consent = readClarityConsent();
    if (consent) {
      applyClarityConsent(consent);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const route = `${location.pathname}${location.search}${location.hash}` || "/";
      setClarityTag("route", route);

      if (document.title) {
        setClarityTag("page_title", document.title);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname, location.search]);

  return null;
};

export default ClarityTracker;
