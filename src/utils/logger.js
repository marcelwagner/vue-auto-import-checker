import { userConfig } from "../config/index.js";
class Logger {
    log;
    constructor() {
        this.log = { info: [], debug: [] };
    }
    get level() {
        return userConfig.debug ? 'debug' : 'info';
    }
    get upperCaseLevel() {
        return this.level.toUpperCase();
    }
    info(message) {
        if (userConfig.outputFormat !== 'json') {
            if (!userConfig.quiet) {
                console.log(userConfig.debug
                    ? `${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`
                    : message);
            }
        }
        else {
            if (userConfig.debug) {
                this.log.debug.push(`${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`);
            }
            else {
                this.log.info.push(message);
            }
        }
    }
    debug(message) {
        if (userConfig.debug) {
            if (userConfig.outputFormat !== 'json') {
                console.log(`${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`);
            }
            else {
                this.log.debug.push(`${new Date().toLocaleString()} [${this.upperCaseLevel}]: ${message}`);
            }
        }
    }
    exit(message, json = {}) {
        if (userConfig.outputFormat === 'json') {
            const output = {
                ...json,
                ...(!userConfig.debug && this.log.info.length >= 1
                    ? { info: this.log.info }
                    : {}),
                exitMessage: message
            };
            console.log(JSON.stringify(output, null, 2));
        }
        else {
            console.log(message);
        }
    }
}
export const logger = new Logger();
