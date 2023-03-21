class UserScriptConfig {
    constructor(name = "user-script-config") {
        this.name = name
        this.version = "0.5.0"
        this.logger = new Logger(name)
    }

    listValues() {
        return GM_listValues()
    }

    containsKey(key) {
        let v = this.getValue(key, undefined)
        if (v != undefined) return true
        return false
    }

    getValue(key, defaultValue) {
        return GM_getValue(key, defaultValue)
    }

    setValue(key, value) {
        return GM_setValue(key, value)
    }

    getOrInitValue(key, initValue) {
        let v = this.getValue(key, undefined)
        if (v == undefined) {
            v = initValue
            this.setValue(key, initValue)
        }
        return v
    }

    deleteValue(key) {
        GM_deleteValue(key)
    }
}