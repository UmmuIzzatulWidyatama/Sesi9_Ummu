const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Sort Produk dari A-Z di SauceDemo', function () {
    let driver;

    this.timeout(30000); // Timeout agar tidak cepat gagal saat proses lambat

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

        // Pilih filter "Name (A to Z)" secara eksplisit
        const dropdown = await driver.findElement(By.css('[data-test="product-sort-container"]'));
        await dropdown.click(); // Buka dropdown
        const optionAZ = await driver.findElement(By.css('option[value="az"]'));
        await optionAZ.click(); // Pilih A-Z

        // Tunggu sorting selesai (DOM re-render)
        await driver.sleep(1000);

        // Ambil semua nama produk
        const productElements = await driver.findElements(By.className('inventory_item_name'));
        const productNames = [];
        for (let el of productElements) {
            productNames.push(await el.getText());
        }

        // Buat salinan lalu urutkan
        const sortedNames = [...productNames].sort();

        // Debug (opsional)
        console.log("Produk tampil:", productNames);
        console.log("Produk urut:", sortedNames);

        // Verifikasi: urutan sudah A-Z
        assert.deepStrictEqual(productNames, sortedNames, 'Produk tidak terurut A-Z');
    });
});
