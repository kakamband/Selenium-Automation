    require("chromedriver");
    let swd = require("selenium-webdriver");
    let fs = require("fs");
    let login,email,pwd;
    let credentialsFile = process.argv[2];
    let bldr=new swd.Builder();
    let driver=bldr.forBrowser("chrome").build();
    let text="Flying Beast";
    (async function () {
        try{
            let data=await fs.promises.readFile(credentialsFile,"utf-8");
            let credentials=JSON.parse(data);
            login=credentials.login;
            pwd=credentials.pwd;
            email=credentials.email;
            let pageWillBeOpenedP=await driver.get("https://www.youtube.com/");
            await pageWillBeOpenedP;
            await driver.manage().setTimeouts({
            implicit: 20000,
            pageLoad: 20000
            });
            let signIn=await driver.findElement(swd.By.css("paper-button[aria-label='Sign in']"));
            await signIn.click();
            let emailSearchBox=await driver.findElement(swd.By.css("#identifierId"));
            await emailSearchBox.sendKeys(email);
            let nextButton=await driver.findElement(swd.By.css("#identifierNext"));
            await nextButton.click();
            // let searchElement=await driver.findElement(swd.By.css(".ytd-searchbox-spt>input"));
            // // console.log(searchElement);identifierNext
            // await searchElement.sendKeys(text+ swd.Key.ENTER);
            // let channel=await driver.findElement(swd.By.css("#main-link"));
            // await channel.click();
            // let videos=await driver.findElements(swd.By.css(".tab-content"));
            // console.log(videos[1]);
            // await videos[1].click();
        }catch(err){    
            console.log(err)
        }
    })();
