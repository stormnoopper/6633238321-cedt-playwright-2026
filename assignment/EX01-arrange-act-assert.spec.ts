// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://katalon-demo-cura.herokuapp.com/';
const VALID_USERNAME = 'John Doe';
const VALID_PASSWORD = 'ThisIsNotAPassword';

test.describe('CURA Healthcare - Login (Arrange-Act-Assert)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'Make Appointment' }).click();
    await expect(page).toHaveURL(/profile\.php#login/);
  });

  test('Verify login pass with valid user', async ({ page }) => {
    // Arrange
    await page.locator('#txt-username').fill(VALID_USERNAME);
    await page.locator('#txt-password').fill(VALID_PASSWORD);

    // Act
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert
    await expect(page).toHaveURL(/#appointment/);
    await expect(page.getByRole('heading', { name: 'Make Appointment' })).toBeVisible();
  });

  test('Verify login fail with invalid password', async ({ page }) => {
    // Arrange
    await page.locator('#txt-username').fill(VALID_USERNAME);
    await page.locator('#txt-password').fill('WrongPassword');

    // Act
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert - still on login page, login failed
    await expect(page).toHaveURL(/profile\.php#login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('Verify login fail with invalid username', async ({ page }) => {
    // Arrange
    await page.locator('#txt-username').fill('InvalidUser');
    await page.locator('#txt-password').fill(VALID_PASSWORD);

    // Act
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert - still on login page, login failed
    await expect(page).toHaveURL(/profile\.php#login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});
