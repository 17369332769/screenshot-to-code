import { HTTP_BACKEND_URL } from "../config";
import { DesignSystem } from "../types";

type DesignSystemsRequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface DesignSystemPayload {
  name: string;
  content: string;
}

export interface DesignSystemsRequestOptions {
  method?: DesignSystemsRequestMethod;
  body?: unknown;
}

export type DesignSystemsRequest = <T>(
  path: string,
  options?: DesignSystemsRequestOptions
) => Promise<T>;

export interface DesignSystemsClient {
  fetchDesignSystems: () => Promise<DesignSystem[]>;
  createDesignSystem: (payload: DesignSystemPayload) => Promise<DesignSystem>;
  updateDesignSystem: (
    id: string,
    payload: Partial<DesignSystemPayload>
  ) => Promise<DesignSystem>;
  deleteDesignSystem: (id: string) => Promise<void>;
}

export const NEW_DESIGN_SYSTEM_CONTENT = `Create interfaces for a screenshot-to-code product with a precise creative-tool aesthetic.

Brand direction:
- Feel like a modern design lab or developer workbench, not a generic SaaS landing page.
- Balance technical precision with editorial calm.
- The result should feel trustworthy, sharp, and premium without looking flashy.

Color:
- Prefer warm off-white, graphite, ink, soft stone, and restrained accent colors.
- Use accent colors sparingly for focus states, key actions, progress, and selected surfaces.
- Avoid purple-heavy gradients and neon rainbow palettes.

Typography:
- Use bold, compact heading hierarchy with clear contrast against quieter body copy.
- Favor a sophisticated sans-serif look with tight headline tracking and comfortable body spacing.
- Avoid oversized marketing copy blocks that feel generic.

Layout and composition:
- Emphasize structured panels, workspaces, rails, canvases, inspectors, and staged content blocks.
- Use asymmetric composition when it helps create visual hierarchy.
- Let the page breathe with generous spacing and distinct section rhythm.
- Avoid repeating identical card grids for every section.

Components:
- Prefer rounded-xl or rounded-2xl surfaces, thin borders, layered panels, and subtle shadow depth.
- Buttons should feel intentional and tactile, not bubbly or toy-like.
- Inputs, tabs, and upload areas should resemble professional tooling.
- Showcase outputs inside framed canvases, browser shells, or mock workspaces.

Motion and interaction:
- Use restrained motion: soft fades, panel lift, shimmer only when it communicates work in progress.
- Hover states should be crisp and minimal.
- Avoid decorative animation that competes with the product.

Content tone:
- Be concise, product-focused, and concrete.
- Describe transformation, iteration, output quality, and workflow speed.
- Avoid vague hype language and filler marketing copy.

Anti-patterns:
- Do not generate cookie-cutter startup pages.
- Do not rely on large gradient blobs as the main visual idea.
- Do not make every section a centered headline above three identical cards.
- Do not overuse emojis, glossy glassmorphism, or fake analytics widgets.
- Do not make the UI feel like a crypto dashboard or consumer social app.`;

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update design systems");
  }

  return response.json() as Promise<T>;
}

function getDesignSystemUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

export function createHttpDesignSystemsRequest(
  baseUrl = HTTP_BACKEND_URL,
  fetcher: typeof fetch = fetch
): DesignSystemsRequest {
  return async <T>(path: string, options: DesignSystemsRequestOptions = {}) => {
    const { method = "GET", body } = options;
    const response = await fetcher(getDesignSystemUrl(baseUrl, path), {
      method,
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return parseJsonResponse<T>(response);
  };
}

export function createDesignSystemsClient(
  request: DesignSystemsRequest
): DesignSystemsClient {
  return {
    fetchDesignSystems: () => request<DesignSystem[]>("/api/design-systems"),
    createDesignSystem: (payload: DesignSystemPayload) =>
      request<DesignSystem>("/api/design-systems", {
        method: "POST",
        body: payload,
      }),
    updateDesignSystem: (
      id: string,
      payload: Partial<DesignSystemPayload>
    ) =>
      request<DesignSystem>(`/api/design-systems/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    deleteDesignSystem: (id: string) =>
      request<void>(`/api/design-systems/${id}`, {
        method: "DELETE",
      }),
  };
}

export const defaultDesignSystemsClient = createDesignSystemsClient(
  createHttpDesignSystemsRequest()
);

export async function fetchDesignSystems(): Promise<DesignSystem[]> {
  return defaultDesignSystemsClient.fetchDesignSystems();
}

export async function createDesignSystem(
  payload: DesignSystemPayload
): Promise<DesignSystem> {
  return defaultDesignSystemsClient.createDesignSystem(payload);
}

export async function updateDesignSystem(
  id: string,
  payload: Partial<DesignSystemPayload>
): Promise<DesignSystem> {
  return defaultDesignSystemsClient.updateDesignSystem(id, payload);
}

export async function deleteDesignSystem(id: string): Promise<void> {
  return defaultDesignSystemsClient.deleteDesignSystem(id);
}
