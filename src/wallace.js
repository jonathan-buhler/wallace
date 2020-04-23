let { getUser } = require("./user");
let _ = require("lodash");
let puppeteer = require("puppeteer");
let moment = require("moment");
let ora = require("ora");
let chalk = require("chalk");

class Wallace {
    constructor() {}
    async startBrowser() {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
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

    async checkAvailability() {
        console.clear();
        let spinner = ora("Wallace is looking into it").start();
        let queries = [];
        let now = moment();
        for (let {} of _.range(3)) {
            queries.push({
                date: now.clone(),
                available: null,
            });
            now.add(1, "week");
        }

        for (let query of queries) {
            await this.lookUp(query);
        }

        spinner.stop();
        this.log(queries);
    }

    async log(responses) {
        let availableSlots = responses.filter((response) => response.available);
        if (availableSlots.length === 0) {
            console.log(chalk.red("Wallace is sad to report that there are presently no slots available"));
        } else {
            for (let slot of availableSlots) {
                console.log(
                    chalk.green(
                        `Wallace says that there's one available on the week of the ${slot.date.format("Do")}: ` +
                            chalk.bold(
                                `https://www.tesco.com/groceries/en-GB/slots/delivery/${slot.date.format("YYYY-MM-DD")}`
                            )
                    )
                );
            }
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

exports.Wallace = Wallace;
