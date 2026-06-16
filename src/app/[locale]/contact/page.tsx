import React, { Suspense } from "react";
import ContactClient from "./ContactClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-brand-purple animate-spin" />
      </div>
    }>
      <ContactClient />
    </Suspense>
  );
}
