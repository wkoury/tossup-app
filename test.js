//TODO: switch this to Cypress
const {Builder, By, Key, until} = require("selenium-webdriver");

(async function example() {
    let driver = await new Builder().forBrowser("firefox").build();
    try{

    await driver.get("http://localhost:8085");
    let links = await driver.findElements(By.css("a"));


    await links[1].click();
    links = await [];
    links = await driver.findElements(By.css("a"));
    await links[2].click();
    let div = await driver.findElement(By.className("room"));
    let room = await div.findElements(By.css("h2"));

    let roomNumber = await room[0].getText();

    console.log("Room: ", await roomNumber);
    if(await roomNumber === ""){
        throw new Error("The room was not initialized!");
    }


    }catch(e) {
        console.error(e);
    }finally{
        await driver.quit();
    }
})();