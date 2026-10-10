"use client";
import { useEffect, useState } from "react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

export function SitePreferences() {
  const { lang, setLang, t } = useI18n();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem("mehr-dark") === "1") setDark(true); } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("mehr-dark", dark ? "1" : "0"); } catch {}
  }, [dark]);

  return (
    <div className="site-preferences">
      <select aria-label={t("pref.lang")} value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
        {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
      </select>
      <button type="button" className="theme-toggle" onClick={() => setDark((v) => !v)} aria-label={dark ? t("pref.light") : t("pref.dark")} title={dark ? t("pref.light") : t("pref.dark")}>
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
