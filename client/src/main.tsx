import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="text-red-500 p-4">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);