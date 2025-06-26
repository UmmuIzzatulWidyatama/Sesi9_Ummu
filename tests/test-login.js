const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Sukses Login SauceDemo', function () {
    let driver;

    before(async function () {
        const options = new chrome.Options();
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Harus bisa login dengan kredensial yang valid', async function () {
        await driver.get('https://www.saucedemo.com/');

        // Isi form login
        const inputUsername = await driver.findElement(By.css('[data-test="username"]'));
        const inputPassword = await driver.findElement(By.css('[data-test="password"]'));
        const loginButton = await driver.findElement(By.css('[data-test="login-button"]'));

        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await loginButton.click();

        // Verifikasi berhasil login dengan mengecek presence shopping cart
        const cartButton = await driver.wait(
            until.elementLocated(By.css('[data-test="shopping-cart-link"]')),
            10000,
            'Cart button harus muncul setelah login'
        );

        assert(await cartButton.isDisplayed(), 'Cart button tidak terlihat, login gagal');

        // Verifikasi logo halaman
        const appLogo = await driver.findElement(By.className('app_logo'));
        const logoText = await appLogo.getText();
        assert.strictEqual(logoText, 'Swag Labs', 'Logo teks tidak sesuai');
    });
});
