const fs = require("fs");
const {execSync} = require("child_process");
const dotenv = require("dotenv");

function exec_cmd(cmd) {
    let stdout = execSync(cmd, {encoding: "utf-8"});
    console.log(stdout);
}

let arg = process.argv.slice(2);
// let env = arg[0];
let env = "production"
let env_file = ".env.production.local"
let env_data = fs.readFileSync(env_file, "utf8");
const parsedEnv = dotenv.parse(env_data);

for (let [key, value] of Object.entries(parsedEnv)) {
    try {
        exec_cmd(`vercel env rm ${key} ${env} -y`);
    } catch (e) {
        // console.error(e);
    }
    exec_cmd(`echo ${value} | vercel env add ${key} ${env}`);
}
