"use client";

import { useTranslations } from "next-intl";

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return <p className="max-w-[460px]">{t("description")}</p>;
}
