import { test, expect } from '@playwright/test'

test('should navigate to the about page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/')
  // Find an element with the text 'About Page' and click on it
  await page.click('text=About Page')
  // The new url should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('/about')
  // The new page should contain an h1 with "About Page"
  await expect(page.locator('h1').first()).toContainText('About Page')
})

test('should show a hidden about page element on mouse over', async ({ page }) => {
  await page.goto('/about')

  const hiddenDiv = await page.getByText('I was hidden')
  await expect(hiddenDiv).not.toBeVisible()

  const hideToggleDiv = await page.getByText('Hover over me')
  await expect(hideToggleDiv).toBeVisible()
  await hideToggleDiv.hover({ force: true })
  await expect(hiddenDiv).toBeVisible()
})

test('should input text into a text box and read that text', async ({ page }) => {
  await page.goto('/about')

  const inputBox = page.locator('input')

  await expect(inputBox).toHaveValue("")

  await inputBox.type("This is a test")
  await expect(inputBox).toHaveValue("This is a test")

  await inputBox.type("This is another test")
  await inputBox.press("Enter")
  await expect(inputBox).toHaveValue("This is a testThis is another test")
})

test('should only show drop down contents after the drop down button is clicked', async ({ page }) => {
  await page.goto('/about')

  const actionOne = page.getByRole('link', { name: 'Action', exact: true })
  const actionTwo = page.getByRole('link', { name: 'Another action', exact: true })
  const actionThree = page.getByRole('link', { name: 'Something else', exact: true })

  await expect(actionOne).not.toBeVisible()
  await expect(actionTwo).not.toBeVisible()
  await expect(actionThree).not.toBeVisible()

  const dropdownButton = page.locator('button')

  await dropdownButton.click()

  await expect(actionOne).toBeVisible()
  await expect(actionTwo).toBeVisible()
  await expect(actionThree).toBeVisible()

  await actionOne.click()
  await actionTwo.click()
  await actionThree.click()
})

test('should navigate back to the home page', async ({ page }) => {
  await page.goto('/about')
  await page.click('text=Go Back')
  await expect(page.getByText('Get started by editing/index.js')).toHaveText('Get started by editing')
})
