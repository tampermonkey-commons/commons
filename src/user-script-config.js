class UserScriptConfig {
    constructor() {
        this.version = "0.1.0"
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
            logger.info(`设置${key}的初始值为：` + v)
            this.setValue(key, initValue)
        }
        return v
    }

    deleteValue(key) {
        GM_deleteValue(key)
    }
}