let { getUser } = require("./user");
let puppeteer = require("puppeteer");
let chalk = require("chalk");

class BrowserHandler {
    constructor() {}

    async startBrowser() {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
        this.browser.on("disconnected", () => {
            console.log(chalk.red("Computer put to sleep, feel free to rerun Wallace"));
            process.exit(1);
        });
    }

    async logIn(user) {
        await this.page.goto("https://secure.tesco.com/account/en-GB/login");
        await this.page.type("#username", user.email);
        await this.page.type("#password", user.password);
        await Promise.all([this.page.waitForNavigation(), this.page.click("#sign-in-form > button")]);
        if (this.page.url() != "https://www.tesco.com/") {
            console.log(chalk.red("Login error, try resetting Wallace"));
            process.exit(1);
        }
    }

    async lookUp(query) {
        await this.page.goto(`https://www.tesco.com/groceries/en-GB/slots/delivery/${query.date.format("YYYY-MM-DD")}`);
        let element = await this.page.$(
            "#slot-matrix > div.tabs > div.tabs__content > div > div > div.hidden-small.hidden-medium-small-only.hidden-medium-only > div > div"
        );
        let text = await this.page.evaluate((element) => element.textContent, element);
        query.available = !(text === "No slots available! Try another day");
    }

    async build() {
        await this.startBrowser();
        await this.logIn(await getUser());
    }
}

exports.BrowserHandler = BrowserHandler;
