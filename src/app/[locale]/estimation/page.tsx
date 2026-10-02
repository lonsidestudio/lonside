import React, { Suspense } from "react";
import EstimationClient from "./EstimationClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.estimation" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function EstimationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const initialMode = resolvedParams?.mode === "regie" ? "regie" : "projects";

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-t-2 border-brand-purple animate-spin" />
        </div>
      }
    >
      <EstimationClient initialMode={initialMode} />
    </Suspense>
  );
}
