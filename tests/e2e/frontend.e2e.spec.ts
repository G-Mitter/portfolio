import { test, expect } from '@playwright/test'

test.describe('Site', () => {
  test('mostra o perfil e o feed na página inicial', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Guilherme Mitter/)
    await expect(page.getByRole('navigation', { name: 'Filtrar projetos' })).toBeVisible()
  })
})
