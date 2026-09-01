import type { ReactNode } from "react";
import { Header } from "@/components/Header";

type LegalArticleProps = {
  title: string;
  children: ReactNode;
};

export function LegalArticle({ title, children }: LegalArticleProps) {
  return (
    <>
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
    </>
  );
}
