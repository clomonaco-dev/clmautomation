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
    <html lang={locale}>
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
