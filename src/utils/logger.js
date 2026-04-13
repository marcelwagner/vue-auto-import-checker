export function createLogger(debug) {
    global.debug = debug;
    const level = debug ? 'debug' : 'info';
    global.logger = {
        info: (message) => {
            console.log(debug ? `${new Date().toLocaleString()} [${level.toUpperCase()}]: ${message}` : message);
        },
        debug: (message) => {
            if (debug) {
                console.log(`${new Date().toLocaleString()} [${level.toUpperCase()}]: ${message}`);
            }
        }
    };
}
export function currentDateTime() {
    return new Date().toLocaleString();
}
