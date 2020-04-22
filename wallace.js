let cron = require("node-cron");
let chalk = require("chalk");
let puppeteer = require("puppeteer");
let prompts = require("prompts");
let ora = require("ora");
let _ = require("lodash");
let moment = require("moment");

class Wallace {
    constructor() {}
    async startBrowser() {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
    }

    async getAccount() {
        let questions = [
            {
                type: "text",
                name: "email",
                message: "What is your email for Tesco.com?",
            },
            {
                type: "password",
                name: "password",
                message: "And what is the your password for Tesco.com?",
            },
        ];

        return await prompts(questions);
    }

    async logIn() {
        let account = await this.getAccount();
        await this.page.goto("https://secure.tesco.com/account/en-GB/login");
        await this.page.type("#username", account.email);
        await this.page.type("#password", account.password);
        await this.page.click("#sign-in-form > button");
    }

    async getAvailability() {
        console.clear();

        let throbber = ora(chalk.blue("Wallace is looking into it")).start();

        let queries = [];

        let now = moment();
        for (let {} of _.range(3)) {
            queries.push({
                date: now,
                available: null,
            });
            now.add(1, "week");
        }

        for (let query of queries) {
            await this.check(query);
        }

        throbber.stop();

        let availableQueries = queries.filter((query) => query.available);
        if (availableQueries.length === 0) {
            console.log(chalk.red("Wallace is sad to report that there are presently no slots available"));
        } else {
            for (let query of availableQueries) {
                console.log(
                    chalk.green(
                        `Wallace says that there's one available on the week of the ${query.date.format("Do")}!`
                    )
                );
            }
        }
    }

    async check(query) {
        await this.page.goto(`https://www.tesco.com/groceries/en-GB/slots/delivery/${query.date.format("YYYY-MM-DD")}`);
        let element = await this.page.$(
            "#slot-matrix > div.tabs > div.tabs__content > div > div > div.hidden-small.hidden-medium-small-only.hidden-medium-only > div > div"
        );
        let text = await this.page.evaluate((element) => element.textContent, element);
        query.available = !(text === "No slots available! Try another day");
    }
}

async function spin() {
    let shopper = new Wallace();
    await shopper.startBrowser();
    await shopper.logIn();
    await shopper.getAvailability();
    cron.schedule("* * * * *", () => {
        shopper.getAvailability();
    });
}

module.exports.spin = spin;
