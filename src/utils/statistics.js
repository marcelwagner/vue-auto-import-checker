class Statistics {
    _initialState;
    _stats;
    constructor() {
        this._initialState = {
            fileCounter: 0,
            dirCounter: 0,
            templateFiles: 0,
            startTime: 0,
            endTime: 0
        };
        this._stats = null;
    }
    start() {
        if (!this._stats) {
            this._stats = { ...this._initialState };
        }
        if (this._stats.startTime === 0) {
            this._stats.startTime = Date.now();
        }
    }
    end() {
        this._stats.endTime = Date.now();
    }
    getStats() {
        return this._stats;
    }
}
export const statistics = new Statistics();
