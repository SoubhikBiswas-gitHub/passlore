import { Generator } from "@/components/generator/Generator"
import { GeneratorFaq } from "@/components/generator/GeneratorFaq"
import { getFaqPageJsonLd } from "@/lib/faq-data"
import {
  organizationSchema,
  webApplicationSchema,
  webSiteSchema,
} from "@/lib/seo"

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqPageJsonLd()) }}
      />

      <Generator>
        <GeneratorFaq />
      </Generator>
    </>
  )
}
