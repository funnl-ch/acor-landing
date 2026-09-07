import type { MetadataRoute } from "next";

/** OAI-AdsBot doit être autorisé explicitement, sinon ChatGPT Ads refuse la page. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "OAI-AdsBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
  };
}
