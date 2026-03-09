// @ts-check
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = process.env.CURA_BASE_URL;

if (!BASE_URL) {
  throw new Error('CURA_BASE_URL environment variable is not set');
}

class HomePage {
  /** @param {Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async openMakeAppointment() {
    await this.page.getByRole('link', { name: 'Make Appointment' }).click();
  }
}

class LoginPage {
  /** @param {Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.page.locator('#txt-username').fill(username);
    await this.page.locator('#txt-password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}

class AppointmentPage {
  /** @param {Page} page */
  constructor(page) {
    this.page = page;
  }

  async selectFacility(value) {
    await this.page.locator('#combo_facility').selectOption(value);
  }

  async toggleReadmission(apply) {
    const checkbox = this.page.getByLabel('Apply for hospital readmission');
    if (apply) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  async selectProgram(programLabel) {
    await this.page.getByLabel(programLabel).check();
  }

  async setVisitDateToToday() {
    const visitDateInput = this.page.getByLabel('Visit Date (Required)');
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const currentDate = `${dd}/${mm}/${yyyy}`;
    await visitDateInput.fill(currentDate);
  }

  async setComment(comment) {
    await this.page.getByPlaceholder('Comment').fill(comment);
  }

  async bookAppointment() {
    await this.page.getByRole('button', { name: 'Book Appointment' }).click();
  }

  async expectConfirmation() {
    // After booking, ensure we are on the appointment page section.
    await expect(this.page).toHaveURL(/#appointment/);
  }
}

test.describe('CURA Healthcare - Make Appointment (Page Object Model)', () => {
  test('should make appointment successfully using POM', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const appointmentPage = new AppointmentPage(page);

    await homePage.goto();
    await homePage.openMakeAppointment();

    await loginPage.login('John Doe', 'ThisIsNotAPassword');

    await appointmentPage.selectFacility('Tokyo CURA Healthcare Center');
    await appointmentPage.toggleReadmission(true);
    await appointmentPage.selectProgram('Medicare');
    await appointmentPage.setVisitDateToToday();
    await appointmentPage.setComment('Automated appointment via Playwright POM');
    await appointmentPage.bookAppointment();

    await appointmentPage.expectConfirmation();
  });
});

