// @ts-check
import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = 'https://katalon-demo-cura.herokuapp.com/';
const VALID_USERNAME = 'John Doe';
const VALID_PASSWORD = 'ThisIsNotAPassword';

const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'Make Appointment' }).click();
    await page.locator('#txt-username').fill(VALID_USERNAME);
    await page.locator('#txt-password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/#appointment/);
    await use(page);
  },
});

test.describe('CURA Healthcare - Make Appointment (Assertions)', () => {
  test('Verify that make appointment page display "Make Appointment" in h2', async ({
    loggedInPage: page,
  }) => {
    await expect(page.locator('h2').filter({ hasText: 'Make Appointment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Make Appointment', level: 2 })).toBeVisible();
  });

  test('Verify that can select all facility combo boxes', async ({
    loggedInPage: page,
  }) => {
    const facilitySelect = page.getByRole('combobox', { name: /facility/i });
    const values = await facilitySelect.locator('option').evaluateAll((opts) =>
      (opts as HTMLOptionElement[]).map((o) => o.value).filter(Boolean)
    );

    for (const value of values) {
      await facilitySelect.selectOption(value);
      await expect(facilitySelect).toHaveValue(value);
    }
    expect(values.length).toBeGreaterThan(0);
  });

  test('Verify that can select apply for hospital readmission checkbox', async ({
    loggedInPage: page,
  }) => {
    const checkbox = page.getByLabel('Apply for hospital readmission');
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('Verify that can select health care program radio button', async ({
    loggedInPage: page,
  }) => {
    const medicare = page.getByLabel('Medicare');
    const medicaid = page.getByLabel('Medicaid');
    const none = page.getByLabel('None');

    await medicare.check();
    await expect(medicare).toBeChecked();

    await medicaid.check();
    await expect(medicaid).toBeChecked();
    await expect(medicare).not.toBeChecked();

    await none.check();
    await expect(none).toBeChecked();
    await expect(medicaid).not.toBeChecked();
  });

  test('Verify that can input current date on Visit Date', async ({
    loggedInPage: page,
  }) => {
    const visitDateInput = page.getByLabel('Visit Date (Required)');
    await expect(visitDateInput).toBeVisible();

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const currentDate = `${dd}/${mm}/${yyyy}`;

    await visitDateInput.fill(currentDate);
    await expect(visitDateInput).toHaveValue(currentDate);
  });

  test('Verify that can input comment', async ({ loggedInPage: page }) => {
    const commentInput = page.getByPlaceholder('Comment');
    const comment = 'Test comment for appointment';
    await commentInput.fill(comment);
    await expect(commentInput).toHaveValue(comment);
  });

  test('Verify that book appointment button is displayed and enabled', async ({
    loggedInPage: page,
  }) => {
    const bookButton = page.getByRole('button', { name: 'Book Appointment' });
    await expect(bookButton).toBeVisible();
    await expect(bookButton).toBeEnabled();
  });
});
