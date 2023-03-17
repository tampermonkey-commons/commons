class Logger {
    constructor(name) {
        this.version = "0.1.0"
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

        return hour + ":" + minute + ":" + second
    }

    debug(text, ...params) {
        let format = "%s [%s] " + text
        if (params.length > 0) {
            console.debug(format, this.getTime(), this.name, params)
        }
        else {
            console.debug(format, this.getTime(), this.name)
        }
    }

    info(text, ...params) {
        let format = "%s [%s] " + text
        if (params.length > 0) {
            console.info(format, this.getTime(), this.name, params)
        }
        else {
            console.info(format, this.getTime(), this.name)
        }
    }

    warn(text, ...params) {
        let format = "%s [%s] " + text
        if (params.length > 0) {
            console.warn(format, this.getTime(), this.name, params)
        }
        else {
            console.warn(format, this.getTime(), this.name)
        }
    }

    error(text, ...params) {
        let format = "%s [%s] " + text
        if (params.length > 0) {
            console.error(format, this.getTime(), this.name, params)
        }
        else {
            console.error(format, this.getTime(), this.name)
        }
    }
}