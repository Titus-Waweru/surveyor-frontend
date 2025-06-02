import React from "react";
import { Helmet } from "react-helmet";

export default function SEO() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "LandLink",
          "url": "https://www.landlink.co.ke/",
          "logo": "https://www.landlink.co.ke/assets/logo.png",
          "founder": {
            "@type": "Person",
            "name": "Titus Waweru "
          },
          "sameAs": [
            "https://www.linkedin.com/in/yourprofile",
            "https://twitter.com/yourhandle",
            "https://www.facebook.com/yourpage"
          ]
        }
        `}
      </script>
    </Helmet>
  );
}
