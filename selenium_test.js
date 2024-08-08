const { Builder, By } = require('selenium-webdriver');

(async function example() {
    // WebDriver'ı başlat
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // HTML sayfasını aç
        await driver.get('http://localhost:8082/index.html');

        // Başlık kontrolü
        let title = await driver.getTitle();
        console.log('Page title:', title); // Başlığı kontrol et
        if (title !== 'Basit HTML Sayfası') { 
            throw new Error('Title does not match ');
        }

        // Butona tıkla
        let button = await driver.findElement(By.className('button'));
        await button.click();
        console.log('Butona tıklama başarılı');
        // 2 saniye bekle
        await driver.sleep(2000);
    } finally {
        // Tarayıcıyı kapat
        await driver.quit();
    }
})();
