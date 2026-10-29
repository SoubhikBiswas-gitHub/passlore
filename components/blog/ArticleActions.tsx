"use client"

import { Export, Link as LinkIcon } from "@phosphor-icons/react"
import { Toast, copyText, useToast } from "@/components/content/Toast"
import { stageBtn } from "@/components/content/styles"

export function ArticleActions({ title, url }: { title: string; url: string }) {
  const toast = useToast()

  const copyLink = async () => {
    const ok = await copyText(url)
    if (ok) toast.show("Link copied.", "ok")
    else toast.show("Couldn’t reach the clipboard — copy the address from your browser.", "error")
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
    if (ok) toast.show("Sharing isn’t available here, so the link was copied.", "info")
    else toast.show("Sharing isn’t available here.", "error")
  }

  return (
    <>
      <button type="button" className={stageBtn} onClick={copyLink}>
        <LinkIcon className="size-5" aria-hidden />
        Copy link
      </button>
      <button type="button" className={stageBtn} onClick={share}>
        <Export className="size-5" aria-hidden />
        Share
      </button>
      <Toast text={toast.text} kind={toast.kind} onDismiss={toast.dismiss} />
    </>
  )
}
