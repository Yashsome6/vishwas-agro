import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { errorHandler } from "./lib/errorHandler";

// Make error handler globally available
window.errorHandler = errorHandler;

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
