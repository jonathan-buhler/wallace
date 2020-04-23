let { BrowserHandler } = require("./browserHandler");
let _ = require("lodash");
let moment = require("moment");
let ora = require("ora");
let chalk = require("chalk");

class Wallace {
    constructor() {
        this.bh = new BrowserHandler();
    }

    async boot() {
        await this.bh.build();
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
            await this.bh.lookUp(query);
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
}

exports.Wallace = Wallace;
