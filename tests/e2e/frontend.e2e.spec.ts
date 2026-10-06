import { test, expect } from '@playwright/test'

test.describe('Site', () => {
  test('a página inicial leva ao portfólio', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Guilherme Mitter/)
    await expect(page.getByRole('link', { name: /Ver meus projetos/ })).toHaveAttribute(
      'href',
      '/portfolio',
    )
  })

  test('mostra o perfil e o feed no portfólio', async ({ page }) => {
    await page.goto('http://localhost:3000/portfolio')

    await expect(page.getByRole('navigation', { name: 'Filtrar projetos' })).toBeVisible()
  })
})
