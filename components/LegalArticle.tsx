import type { ReactNode } from "react";
import { Header } from "@/components/Header";

type LegalArticleProps = {
  title: string;
  children: ReactNode;
};

export function LegalArticle({ title, children }: LegalArticleProps) {
  return (
    <div className="bg-canvas px-3 pt-3 sm:px-6 sm:pt-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[12px] border-[0.5px] border-line bg-page">
        <Header />
        <main id="contenu" className="bg-page">
          <article className="px-5 py-12 text-left sm:px-8 sm:py-16">
            <div className="mx-auto max-w-[68ch]">
              <h1 className="text-[32px] font-extrabold tracking-[-0.04em] text-ink">
                {title}
              </h1>
              <div className="legal-body mt-8">{children}</div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
