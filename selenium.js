require("chromedriver");
let swd = require("selenium-webdriver");
let fs = require("fs");
const { measureMemory } = require("vm");
let login, email, pwd;
let credentialsFile = process.argv[2];
let bldr = new swd.Builder();
let driver = bldr.forBrowser("chrome").build();
let text = "Aishwarya Mohanraj";
let goToUrl;
let views,name;
(async function () {
    try {
        let data = await fs.promises.readFile(credentialsFile, "utf-8");
        let credentials = JSON.parse(data);
        login = credentials.login;
        pwd = credentials.pwd;
        email = credentials.email;
        //let pageWillBeOpenedP = await driver.get("https://stackoverflow.com/users/login?ssrc=head&returnurl=https%3a%2f%2fstackoverflow.com%2f");
        // await pageWillBeOpenedP;
        await driver.manage().setTimeouts({
            implicit: 40000,
            pageLoad: 40000
        });
        //let openGoogle = (await driver).findElement(swd.By.css("button[data-oauthserver='https://accounts.google.com/o/oauth2/auth']"));
        //await openGoogle.click();

        let openYoutube = await driver.get("https://www.youtube.com");

        await signInYoutube();

        let emailSearchBox = await driver.findElement(swd.By.css("#identifierId"));
        await emailSearchBox.sendKeys(email);
        let nextButton = await driver.findElement(swd.By.css("#identifierNext"));
        await nextButton.click();
        let pswdSearchBox = await driver.findElement(swd.By.css("input[name='password']"));
        await pswdSearchBox.sendKeys(pwd);

        let signInButton = await driver.findElement(swd.By.css("#passwordNext"));
        await signInButton.click();


        

        let searchElement = await driver.findElement(swd.By.css(".ytd-searchbox-spt>input"));
        // console.log(searchElement);identifierNext
        await searchElement.sendKeys(text + swd.Key.ENTER);
        let channel = await driver.findElement(swd.By.css("#main-link"));
        await channel.click();
        let videosTab = await driver.findElements(swd.By.css(".tab-content"));
        //console.log(videosTab[1]);
        await videosTab[1].click();
        await sort();
        let videos = await driver.findElements(swd.By.css(".yt-simple-endpoint.style-scope.ytd-grid-video-renderer"));
        console.log(videos.length);
        // for (var i = 0; i < videos.length; i++) {
        //     console.log(videos[i]);
            // console.log('opening video ', i);
            await like(videos[0]);
        //     console.log('like fn for video ', i);
        //     console.log('closing video ', i);
        //     await driver.get(goToUrl);
        // }

        await sendMail();

    } catch (err) {
        console.log(err);
    }
})();


async function sort(){
  let dropdown=await driver.findElements(swd.By.css('#label-icon'));
  await dropdown[1].click();
  let mostPopular=await driver.findElements(swd.By.css('#menu> a:nth-child(1)'));
  await mostPopular[1].click();
}

async function like(video) {
    try {
        await video.click();
        goToUrl = await driver.getCurrentUrl();
        console.log(goToUrl);
        let body=(await driver).findElement(swd.By.css("body"));
        body.sendKeys(swd.Key.SPACE);
        let viewsBox=(await driver).findElement(swd.By.css('.view-count'));
        views=await viewsBox.getText(); 
        let nameBox=await driver.findElement(swd.By.css('#container > h1 > yt-formatted-string'));
        name=await nameBox.getText();
        let likeAndDislike = await driver.findElements(swd.By.css("#top-level-buttons .style-scope .ytd-toggle-button-renderer button#button"));
        let like = likeAndDislike[0];
        let val = await like.getAttribute('aria-pressed');
        console.log(val);
        if (val == "false") {
            console.log('liking video');
            await like.click();
        }
        else {
            console.log("already liked");
        }
    } catch (err) {
        console.log(err);
    }
}

async function signInYoutube() {
    try {
        let signIn = await driver.findElement(swd.By.css("paper-button[aria-label='Sign in']"));
        await signIn.click();
    }
    catch (err) {

    }
}

async function sendMail(){
    let inboxPage=await driver.get("https://mail.google.com/mail/u/0/");
    let compose=await driver.findElement(swd.By.css('.aic div[role="button"]'));
    await compose.click();
    let emailTo=await driver.findElement(swd.By.css('textarea[name="to"]'));
    await emailTo.sendKeys("swt.abhimanyu.31@gmail.com");
    let subject=await driver.findElement(swd.By.css('input[name="subjectbox"]'));
    await subject.sendKeys(`Check the most popular video of ${text}`);
    let message=await driver.findElement(swd.By.css(' div.tS-tW[role="textbox"]'));
    await message.sendKeys(`Name of video -> ${name}`,swd.Key.ENTER,`Total views on video = ${views}`,swd.Key.ENTER,'Click on the link to go to the video', goToUrl);
    console.log(`Total views on video = ${views}`);
    await message.sendKeys(goToUrl);
    let send=await driver.findElement(swd.By.css('.aoO'));
    await send.click();
}