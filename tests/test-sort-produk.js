const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Sort Produk dari A-Z di SauceDemo', function () {
    let driver;

    this.timeout(30000); // Set timeout agar tidak timeout saat load lambat

    before(async function () {
        const options = new chrome.Options();
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Login dan sort produk dari A-Z', async function () {
        await driver.get('https://www.saucedemo.com/');

        // Login
        await driver.findElement(By.css('[data-test="username"]')).sendKeys('standard_user');
        await driver.findElement(By.css('[data-test="password"]')).sendKeys('secret_sauce');
        await driver.findElement(By.css('[data-test="login-button"]')).click();

        // Tunggu halaman produk muncul
        await driver.wait(until.elementLocated(By.className('inventory_list')), 10000);

        // Pilih filter sort A-Z
        const sortDropdown = await driver.findElement(By.css('[data-test="product-sort-container"]'));
        await sortDropdown.sendKeys('Name (A to Z)');

        // Tunggu sort selesai (opsional: delay)
        await driver.sleep(1000);

        // Ambil semua nama produk
        const productElements = await driver.findElements(By.className('inventory_item_name'));
        const productNames = [];

        for (let el of productElements) {
            const name = await el.getText();
            productNames.push(name);
        }

        // Buat salinan dan urutkan secara manual
        const sortedNames = [...productNames].sort();

        // Cek apakah urutan produk sudah sesuai dari A-Z
        assert.deepStrictEqual(productNames, sortedNames, 'Produk tidak terurut A-Z');
    });
});
