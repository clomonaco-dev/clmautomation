import { siteUrl, email, phone, type Locale } from "@/lib/routes";
export function RootDocument({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "CLM Automation",
    url: siteUrl,
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Viale Parona 33",
      addressLocality: "Gozzano",
      addressRegion: "NO",
      addressCountry: "IT",
    },
    areaServed: "Novara",
    availableLanguage: ["Italian", "English"],
  };
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          // Enables reveal animations before first paint; falls back to
          // static content if the motion layer does not start.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-live'))d.classList.remove('motion')},3000)})()",
          }}
        />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
