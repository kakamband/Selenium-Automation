    require("chromedriver");
    let swd = require("selenium-webdriver");
    let fs = require("fs");
    let login,email,pwd;
    let credentialsFile = process.argv[2];
    let bldr=new swd.Builder();
    let driver=bldr.forBrowser("chrome").build();
    let text="Aishwarya Mohanraj";
    (async function () {
        try{
            let data=await fs.promises.readFile(credentialsFile,"utf-8");
            let credentials=JSON.parse(data);
            login=credentials.login;
            pwd=credentials.pwd;
            email=credentials.email;
            let pageWillBeOpenedP=await driver.get("https://stackoverflow.com/users/login?ssrc=head&returnurl=https%3a%2f%2fstackoverflow.com%2f");
            await pageWillBeOpenedP;
            await driver.manage().setTimeouts({
            implicit: 20000,
            pageLoad: 20000
            });
            let openGoogle= (await driver).findElement(swd.By.css("button[data-oauthserver='https://accounts.google.com/o/oauth2/auth']"));
            await openGoogle.click();

            let emailSearchBox=await driver.findElement(swd.By.css("#identifierId"));
            await emailSearchBox.sendKeys(email);
            let nextButton=await driver.findElement(swd.By.css("#identifierNext"));
            await nextButton.click();
            let pswdSearchBox= await driver.findElement(swd.By.css("input[name='password']"));
            await pswdSearchBox.sendKeys(pwd);
            
            let signInButton=await driver.findElement(swd.By.css("#passwordNext"));
            await signInButton.click();


            let openYoutube=await (await driver).get("https://www.youtube.com");
            await openYoutube;

            let signIn=await driver.findElement(swd.By.css("paper-button[aria-label='Sign in']"));
            await signIn.click();

            let searchElement=await driver.findElement(swd.By.css(".ytd-searchbox-spt>input"));
            // console.log(searchElement);identifierNext
            await searchElement.sendKeys(text+ swd.Key.ENTER);
            let channel=await driver.findElement(swd.By.css("#main-link"));
            await channel.click();
            let videos=await driver.findElements(swd.By.css(".tab-content"));
            console.log(videos[1]);
            await videos[1].click();
            let video=await driver.findElement(swd.By.css("#details"));
            await video.click();
            let like=await driver.findElement(swd.By.css(".style-scope .ytd-menu-renderer .force-icon-button .style-text"));
            await like.click();
        }catch(err){    
            console.log(err)
        }
    })();
