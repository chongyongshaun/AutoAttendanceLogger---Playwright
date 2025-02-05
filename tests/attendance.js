import { chromium } from 'playwright';
import { test, expect } from '@playwright/test';
import { writeFileSync, existsSync, readFileSync } from 'fs';

const COOKIE_FILE = 'cookies.json';

async function saveCookies(page) {
    const cookies = await page.context().cookies();
    writeFileSync(COOKIE_FILE, JSON.stringify(cookies));
    console.log('Cookies saved.');
}

async function loadCookies(page) {
    if (existsSync(COOKIE_FILE)) {
        const cookies = JSON.parse(readFileSync(COOKIE_FILE));
        await page.context().addCookies(cookies);
        console.log('Cookies loaded.');
    }
}

async function submitAttendance() {
    const browser = await chromium.launch({ headless: false }); // Set to false for first login
    const context = await browser.newContext();
    const page = await context.newPage();

    if (existsSync(COOKIE_FILE)) {
        await loadCookies(page);
    }

    try {
        await page.goto('https://vlegalwaymayo.atu.ie/');

        if (!existsSync(COOKIE_FILE)) {
            console.log('Please log in manually.');
            await page.waitForTimeout(60000); // Allow time to log in manually
            await saveCookies(page);
        }
        //check if im logged in, check for title
        await expect(page).toHaveTitle(/Home/);
        await page.getByRole('link', { name: '24-25: 8896 -- DATABASE DEVELOPMENT' }).click();
        await page.getByRole('link', { name: 'Attendance Lectures and Labs' }).click();
        console.log("arrived at the attendance page");

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

submitAttendance();
