import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import { seoLandingPagesByPath } from "../lib/seo-pages";

const SITE_URL = "https://screenshottocode.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/twitter-summary-card.png`;

type RobotsValue = "index,follow" | "noindex,nofollow";

function upsertMetaAttribute(
  selector: string,
  attributeName: "name" | "property",
  attributeValue: string,
  content: string
) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector(
    "link[rel='canonical']"
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function upsertAlternateLanguage(hreflang: string, href: string) {
  const selector = `link[rel='alternate'][hreflang='${hreflang}']`;
  let link = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", hreflang);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function upsertJsonLd(id: string, payload: object) {
  let script = document.head.querySelector(
    `script[data-seo-json-ld='${id}']`
  ) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJsonLd = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

function removeJsonLd(id: string) {
  document.head
    .querySelector(`script[data-seo-json-ld='${id}']`)
    ?.remove();
}

export function usePageSeo() {
  const location = useLocation();
  const { language, t } = useI18n();

  useEffect(() => {
    const path = location.pathname;
    const canonicalUrl = new URL(path, SITE_URL).toString();
    const seoLandingPage = seoLandingPagesByPath[path];
    const isHomePage = path === "/";
    const isIndexablePage = isHomePage || Boolean(seoLandingPage);
    const robots: RobotsValue = isIndexablePage
      ? "index,follow"
      : "noindex,nofollow";
    const title = isHomePage
      ? `${t("turnScreenshotsIntoCode")} | ${t("imageToCodeWebsite")}`
      : seoLandingPage?.title ?? "Image to Code";
    const description = isHomePage
      ? t("heroDescription")
      : seoLandingPage?.description ?? "Internal tooling for Image to Code.";

    document.title = title;

    upsertMetaAttribute("meta[name='description']", "name", "description", description);
    upsertMetaAttribute("meta[name='robots']", "name", "robots", robots);
    upsertMetaAttribute(
      "meta[name='googlebot']",
      "name",
      "googlebot",
      robots
    );
    upsertMetaAttribute("meta[property='og:title']", "property", "og:title", title);
    upsertMetaAttribute(
      "meta[property='og:description']",
      "property",
      "og:description",
      description
    );
    upsertMetaAttribute("meta[property='og:url']", "property", "og:url", canonicalUrl);
    upsertMetaAttribute("meta[property='og:image']", "property", "og:image", DEFAULT_OG_IMAGE);
    upsertMetaAttribute(
      "meta[property='og:locale']",
      "property",
      "og:locale",
      language === "zh" ? "zh_CN" : "en_US"
    );
    upsertMetaAttribute("meta[name='twitter:title']", "name", "twitter:title", title);
    upsertMetaAttribute(
      "meta[name='twitter:description']",
      "name",
      "twitter:description",
      description
    );
    upsertMetaAttribute(
      "meta[name='twitter:image']",
      "name",
      "twitter:image",
      DEFAULT_OG_IMAGE
    );

    upsertCanonical(canonicalUrl);
    upsertAlternateLanguage("en", canonicalUrl);
    upsertAlternateLanguage("zh-CN", canonicalUrl);
    upsertAlternateLanguage("x-default", canonicalUrl);

    if (isHomePage) {
      upsertJsonLd("organization", {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Image to Code",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon/log-square.png`,
      });

      upsertJsonLd("software", {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Image to Code",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description,
        url: canonicalUrl,
        image: DEFAULT_OG_IMAGE,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      });

      upsertJsonLd("faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: t("faq1Question"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faq1Answer"),
            },
          },
          {
            "@type": "Question",
            name: t("faq2Question"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faq2Answer"),
            },
          },
          {
            "@type": "Question",
            name: t("faq3Question"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faq3Answer"),
            },
          },
          {
            "@type": "Question",
            name: t("faq4Question"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faq4Answer"),
            },
          },
          ],
      });
      removeJsonLd("breadcrumb");
    } else if (seoLandingPage) {
      upsertJsonLd("software", {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Image to Code",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description,
        url: canonicalUrl,
        image: DEFAULT_OG_IMAGE,
      });

      upsertJsonLd("faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seoLandingPage.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      });

      upsertJsonLd("breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Image to Code",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: seoLandingPage.headline,
            item: canonicalUrl,
          },
        ],
      });

      removeJsonLd("organization");
    } else {
      removeJsonLd("organization");
      removeJsonLd("software");
      removeJsonLd("faq");
      removeJsonLd("breadcrumb");
    }
  }, [language, location.pathname, t]);
}
