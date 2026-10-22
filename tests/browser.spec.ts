import { test, expect } from "@playwright/test"

test("generator hydrates, regenerates, and switches modes", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/")
  await page.getByRole("button", { name: "Reject", exact: true }).click()
  const output = page.getByRole("region", { name: "Password", exact: true }).locator("[aria-label]").filter({ hasText: /.+/ }).first()
  await expect(output).not.toHaveText("")
  const previous = await output.textContent()
  await page.getByRole("button", { name: "Generate", exact: true }).click()
  await expect(output).not.toHaveText(previous || "")
  await page.getByRole("tab", { name: "Passphrase", exact: true }).click()
  await expect(page.getByRole("slider", { name: "Word count slider" })).toBeVisible()
  await expect(output).toHaveText(/^[a-z]+(?:-[a-z]+){3}$/)
  await page.getByRole("tab", { name: "PIN", exact: true }).click()
  await expect(output).toHaveText(/^\d+$/)
  expect(errors).toEqual([])
})

test("public routes and crawler rules match the deployment", async ({ request }) => {
  for (const path of ["/", "/about", "/blog", "/blog/how-to-create-a-strong-password-in-2025", "/privacy", "/terms", "/sitemap.xml", "/opengraph-image"]) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    if (process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "play") {
      expect(response.headers()["x-robots-tag"], path).toContain("noindex")
    } else {
      expect(response.headers()["x-robots-tag"], path).toBeUndefined()
    }
  }
  const robots = await request.get("/robots.txt")
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain(process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "play" ? "Disallow: /\n" : "Allow: /")
  expect((await request.get("/missing-page")).status()).toBe(404)
})

test("testing pages discourage indexing and do not load production analytics", async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_DEPLOYMENT_ENV !== "play")
  await page.goto("/privacy")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
  await page.getByRole("button", { name: "Accept", exact: true }).click()
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0)
})
