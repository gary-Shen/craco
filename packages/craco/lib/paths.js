const fs = require("fs");
const { log } = require("./logger");

const projectRoot = fs.realpathSync(process.cwd());
let paths = {};
try {
    const app = JSON.parse(process.env.APP);
    if (app) {
        paths = app.paths || paths;
    }
} catch (err) {
    log.error(err);
}

log("Project root path resolved to: ", projectRoot);

module.exports = {
    projectRoot,
    ...paths
};
