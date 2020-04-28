let fs = require("fs");
let path = require("path");
let prompts = require("prompts");

let accountPath = path.resolve("src/accounts.json");

async function getAccount() {
    console.clear();
    if (fs.existsSync(accountPath)) {
        let accounts = require(accountPath);
        if (accounts.length == 1) {
            return accounts[0];
        } else {
            let question = {
                type: "select",
                name: "account",
                message: "Which account should Wallace use?",
                choices: accounts.map((account) => {
                    return {
                        title: account.email,
                        value: account,
                    };
                }),
            };
            let response = await prompts(question);
            return response.account;
        }
    } else {
        return await addAccount();
    }
}

async function createAccount() {
    console.clear();
    let questions = [
        {
            type: "text",
            name: "email",
            message: "What is your email for Tesco.com?",
        },
        {
            type: "invisible",
            name: "password",
            message: "And what is the your password for Tesco.com?",
        },
    ];
    return await prompts(questions);
}

async function addAccount() {
    let account = await createAccount();
    if (!fs.existsSync(accountPath)) {
        fs.writeFileSync(accountPath, JSON.stringify([account]));
    } else {
        let accounts = require(accountPath);
        accounts.push(account);
        fs.writeFileSync(accountPath, JSON.stringify(accounts));
    }
    return account;
}

function clearAccounts() {
    fs.unlinkSync(accountPath);
}

exports.getAccount = getAccount;
exports.addAccount = addAccount;
exports.clearAccounts = clearAccounts;
