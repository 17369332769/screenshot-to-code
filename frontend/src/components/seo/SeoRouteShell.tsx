import { ReactNode } from "react";
import { usePageSeo } from "../../hooks/usePageSeo";

function SeoRouteShell({ children }: { children: ReactNode }) {
  usePageSeo();
  return <>{children}</>;
}

export default SeoRouteShell;
