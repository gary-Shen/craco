#!/usr/bin/env node

const spawn = require("cross-spawn");

const args = process.argv.slice(2);
const scriptIndex = args.findIndex(x => x === "build" || x === "start" || x === "test");
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

switch (script) {
    case "build":
    case "start":
    case "test": {
        const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];
        const scriptPath = require.resolve(`../scripts/${script}`);
        const scriptArgs = args.slice(scriptIndex + 1);
        const processArgs = nodeArgs.concat(scriptPath).concat(scriptArgs);

        const child = spawn("node", processArgs, { stdio: "inherit" });

        process.send &&
            process.send({
                pid: child.pid
            });

        child.on("exit", () => {
            console.log("child exit");
        });

        process.on("exit", () => {
            console.log("craco进程已退出！");
            process.send &&
                process.send({
                    exit: true
                });
        });

        child.on("close", () => {
            console.log("child close");
        });

        ["SIGINT", "SIGTERM"].forEach(signal => {
            process.on(signal, () => {
                process.exit(1);
            });
        });
        break;
    }
    default:
        console.log(`Unknown script "${script}".`);
        console.log("Perhaps you need to update craco?");
        break;
}
