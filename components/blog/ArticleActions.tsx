"use client"

import { LinkSimple, ShareNetwork } from "@phosphor-icons/react"
import { Toast, copyText, useToast } from "@/components/content/Toast"
import { stageBtn } from "@/components/content/styles"

export function ArticleActions({ title, url }: { title: string; url: string }) {
  const toast = useToast()

  const copyLink = async () => {
    const ok = await copyText(url)
    toast.show(ok ? "Link copied." : "Couldn’t reach the clipboard — copy the address from your browser.")
  }

  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url })
      } catch {
        return
      }
      return
    }
    const ok = await copyText(url)
    toast.show(ok ? "Sharing isn’t available here, so the link was copied." : "Sharing isn’t available here.")
  }

  return (
    <>
      <button type="button" className={stageBtn} onClick={copyLink}>
        <LinkSimple className="size-5" aria-hidden />
        Copy link
      </button>
      <button type="button" className={stageBtn} onClick={share}>
        <ShareNetwork className="size-5" aria-hidden />
        Share
      </button>
      <Toast text={toast.text} onDismiss={toast.dismiss} />
    </>
  )
}
