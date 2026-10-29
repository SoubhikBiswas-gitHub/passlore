import { Plus } from "@phosphor-icons/react/dist/ssr"
import { FAQ_ITEMS } from "@/lib/faq-data"
import s from "./Generator.module.css"

export function GeneratorFaq() {
  return (
    <section className={`${s.wrap} ${s.faq}`} aria-labelledby="faq-h">
      <h2 id="faq-h" className={s.h2} style={{ marginBottom: 16 }}>Questions people ask</h2>
      <div className={s.faqList}>
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className={s.faqItem}>
            <summary>
              {item.question}
              <Plus size={20} aria-hidden="true" className={s.faqIcon} />
            </summary>
            <p className={s.faqAnswer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
