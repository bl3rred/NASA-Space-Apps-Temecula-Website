import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/motion.css";

const isMobileBrowser =
  typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isMobileBrowser && "scrollRestoration" in history) {
  // Keep Safari/Chrome from restoring a visual/page offset captured at a
  // different native zoom level before the CSS-zoom canvas has laid out.
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
