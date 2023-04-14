import { test, expect } from '@playwright/test'

test('web app deve estar online', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')
})
