let fs = require("fs");
let prompts = require("prompts");

async function getUser() {
    if (fs.existsSync("./.data/user.json")) {
        return require("../.data/user.json");
    } else {
        return await createUser();
    }
}

async function createUser() {
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
    console.clear();
    let response = await prompts(questions);
    if (!fs.existsSync("./.data/")) {
        fs.mkdirSync("./.data");
    }
    fs.writeFileSync("./.data/user.json", JSON.stringify(response));
    return response;
}

function clearUser() {
    fs.unlinkSync("./.data/user.json");
}

exports.getUser = getUser;
exports.clearUser = clearUser;
