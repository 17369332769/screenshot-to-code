import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import { seoLandingPagesByPath } from "../lib/seo-pages";

const SITE_URL = "https://imagetocode.pro";
const SITE_NAME = "Image to Code";
const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/twitter-summary-card.png`;
const DEFAULT_OG_IMAGE_ALT =
  "Image to Code workspace turning UI references into editable frontend drafts";
const SOCIAL_PROFILE_URLS = [
  "https://github.com/abi/screenshot-to-code",
  "https://twitter.com/_abi_",
];
const APP_FEATURES = [
  "Screenshot to frontend code generation",
  "Website URL to editable frontend draft",
  "Figma screenshot to code workflow",
  "Live preview and iterative editing",
  "React, HTML, Vue, and Tailwind output targets",
];

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

function removeAlternateLanguages() {
  document.head
    .querySelectorAll("link[rel='alternate'][hreflang]")
    .forEach((element) => element.remove());
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
    const pageType = isHomePage ? "website" : "article";

    document.title = title;

    upsertMetaAttribute("meta[name='description']", "name", "description", description);
    upsertMetaAttribute("meta[name='author']", "name", "author", SITE_NAME);
    upsertMetaAttribute("meta[name='robots']", "name", "robots", robots);
    upsertMetaAttribute(
      "meta[name='googlebot']",
      "name",
      "googlebot",
      robots
    );
    upsertMetaAttribute("meta[property='og:type']", "property", "og:type", pageType);
    upsertMetaAttribute(
      "meta[property='og:site_name']",
      "property",
      "og:site_name",
      SITE_NAME
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
      "meta[property='og:image:alt']",
      "property",
      "og:image:alt",
      DEFAULT_OG_IMAGE_ALT
    );
    upsertMetaAttribute(
      "meta[property='og:locale']",
      "property",
      "og:locale",
      language === "zh" ? "zh_CN" : "en_US"
    );
    upsertMetaAttribute(
      "meta[name='twitter:card']",
      "name",
      "twitter:card",
      "summary_large_image"
    );
    upsertMetaAttribute("meta[name='twitter:site']", "name", "twitter:site", "@picoapps");
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
    upsertMetaAttribute(
      "meta[name='twitter:image:alt']",
      "name",
      "twitter:image:alt",
      DEFAULT_OG_IMAGE_ALT
    );

    upsertCanonical(canonicalUrl);
    removeAlternateLanguages();

    if (isHomePage) {
      upsertJsonLd("website", {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: language === "zh" ? "zh-CN" : "en",
      });

      upsertJsonLd("organization", {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon/log-square.png`,
        sameAs: SOCIAL_PROFILE_URLS,
      });

      upsertJsonLd("software", {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "AI code generation",
        operatingSystem: "Web",
        description,
        url: canonicalUrl,
        image: DEFAULT_OG_IMAGE,
        featureList: APP_FEATURES,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
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
            name: t("faqAccuracyQuestion"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faqAccuracyAnswer"),
            },
          },
          {
            "@type": "Question",
            name: t("faqFrameworksQuestion"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faqFrameworksAnswer"),
            },
          },
          {
            "@type": "Question",
            name: t("faqEditGeneratedQuestion"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faqEditGeneratedAnswer"),
            },
          },
          {
            "@type": "Question",
            name: t("faqResponsiveQuestion"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faqResponsiveAnswer"),
            },
          },
          {
            "@type": "Question",
            name: t("faqTailwindQuestion"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faqTailwindAnswer"),
            },
          },
          {
            "@type": "Question",
            name: t("faqExistingWebsitesQuestion"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("faqExistingWebsitesAnswer"),
            },
          },
        ],
      });
      removeJsonLd("breadcrumb");
    } else if (seoLandingPage) {
      upsertJsonLd("software", {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "AI code generation",
        operatingSystem: "Web",
        description,
        url: canonicalUrl,
        image: DEFAULT_OG_IMAGE,
        featureList: APP_FEATURES,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
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
            name: SITE_NAME,
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
      removeJsonLd("website");
    } else {
      removeJsonLd("website");
      removeJsonLd("organization");
      removeJsonLd("software");
      removeJsonLd("faq");
      removeJsonLd("breadcrumb");
    }
  }, [language, location.pathname, t]);
}
