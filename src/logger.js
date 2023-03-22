export default class Logger {
    constructor(name = "logger") {
        this.name = name
    }

    getTime() {
        let now = new Date()

        let hour = now.getHours() + ""
        if (hour.length == 1) hour = "0" + hour

        let minute = now.getMinutes() + ""
        if (minute.length == 1) minute = "0" + minute

        let second = now.getSeconds() + ""
        if (second.length == 1) second = "0" + second

        let milliSec = now.getMilliseconds() + ""
        if (milliSec.length == 1) milliSec = "00" + milliSec
        else if (milliSec.length == 2) milliSec = "0" + milliSec

        return `${hour}:${minute}:${second}.${milliSec}`
    }

    debug(text, ...params) {
        this.log(console.debug, "DEBUG", text, ...params)
    }

    info(text, ...params) {
        this.log(console.info, "INFO", text, ...params)
    }

    warn(text, ...params) {
        this.log(console.warn, "WARN", text, ...params)
    }

    error(text, ...params) {
        this.log(console.error, "ERROR", text, ...params)
    }

    log(func, level, text, ...params) {
        let format = "%s [%s] %s " + text
        if (params != null && params.length > 0) {
            func(format, this.getTime(), this.name, level, ...params)
        }
        else {
            func(format, this.getTime(), this.name, level)
        }
    }
}