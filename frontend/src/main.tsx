import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RouteFallback from "./components/seo/RouteFallback.tsx";
import SeoRouteShell from "./components/seo/SeoRouteShell.tsx";
import { I18nProvider } from "./i18n.tsx";
import { seoLandingPages } from "./lib/seo-pages";

const EvalsPage = lazy(() => import("./components/evals/EvalsPage.tsx"));
const PairwiseEvalsPage = lazy(
  () => import("./components/evals/PairwiseEvalsPage")
);
const RunEvalsPage = lazy(() => import("./components/evals/RunEvalsPage.tsx"));
const BestOfNEvalsPage = lazy(
  () => import("./components/evals/BestOfNEvalsPage.tsx")
);
const AllEvalsPage = lazy(() => import("./components/evals/AllEvalsPage.tsx"));
const OpenAIInputComparePage = lazy(
  () => import("./components/evals/OpenAIInputComparePage.tsx")
);
const PromptReportsPage = lazy(
  () => import("./components/evals/PromptReportsPage.tsx")
);
const SeoLandingPage = lazy(
  () => import("./components/seo/SeoLandingPage.tsx")
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <Router>
        <SeoRouteShell>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<App />} />
              {seoLandingPages.map((page) => (
                <Route
                  key={page.path}
                  path={page.path}
                  element={<SeoLandingPage page={page} />}
                />
              ))}
              <Route path="/evals" element={<AllEvalsPage />} />
              <Route path="/evals/single" element={<EvalsPage />} />
              <Route path="/evals/pairwise" element={<PairwiseEvalsPage />} />
              <Route path="/evals/best-of-n" element={<BestOfNEvalsPage />} />
              <Route path="/evals/run" element={<RunEvalsPage />} />
              <Route
                path="/evals/openai-input-compare"
                element={<OpenAIInputComparePage />}
              />
              <Route path="/evals/prompt-reports" element={<PromptReportsPage />} />
            </Routes>
          </Suspense>
        </SeoRouteShell>
      </Router>
      <Toaster toastOptions={{ className: "dark:bg-zinc-950 dark:text-white" }} />
    </I18nProvider>
  </React.StrictMode>
);
