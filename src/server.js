let { Wallace } = require("./wallace");
let cron = require("node-cron");
let ora = require("ora");
let chalk = require("chalk");

async function serve() {
    let w = new Wallace();
    await w.boot();
    await w.checkAvailability();
    let spinner = ora(
        "Reading Moby Dick and waiting for the next run " + chalk.dim("(Press 'ctrl+c' to quit)")
    ).start();
    cron.schedule("* * * * *", async () => {
        spinner.stop();
        await w.checkAvailability();
        spinner.start();
    });
}

process.on("SIGINT", () => {
    console.clear();
    console.log(chalk.green.bold("Thank you for using Wallace, I hope he was helpful!"));
});

exports.serve = serve;
