class Skeleton {
    constructor(options) {
        this.name = options.hasOwnProperty("name") ? options.name : GM_info.script.name
        this.version = options.hasOwnProperty("version") ? options.version : GM_info.script.version
        this.optionsUrl = options.hasOwnProperty("url") ? options.url : null

        this.logger = new Logger(this.name)
        this.injector = new DynamicInjector()

        // 注入挂载点和样式
        this.appNodeId = null
        this.injectStyles = null

        // 注入vue、options
        this.vueVersion = options.hasOwnProperty("vue") ? options.vue : null
        this.vue = null
        this.vueOptions = null
        this.vueApp = null

        // 注入element
        this.elementVersion = options.hasOwnProperty("element") ? options.element : null
        this.element = null

        // 注入vuex、options
        this.vuexVersion = options.hasOwnProperty("vuex") ? options.vuex : null
        this.vuex = null
        this.storeOptions = null
    }

    async dynamicInjectVue() {
        let injectSucc = false
        let app = this

        if (this.vueVersion != null) {
            injectSucc = await this.injector.dynamicInject("vue", this.vueVersion, "/dist/vue.global.prod.js", 5000, () => {
                if (typeof Vue != 'undefined') {
                    app.vue = Vue
                    app.logger.info("Vue %s Loaded.", app.vue.version)
                    return true
                }
            })
            if (!injectSucc) return injectSucc
        }

        if (this.elementVersion != null) {
            injectSucc = await this.injector.dynamicInject("element-plus", this.elementVersion, "/dist/index.full.min.js", 5000, () => {
                if (typeof ElementPlus != 'undefined') {
                    app.element = ElementPlus
                    app.logger.info("Element Plus %s Loaded.", app.element.version)
                    return true
                }
            })
            if (!injectSucc) return injectSucc

            this.injector.dynamicInject("element-plus", this.elementVersion, "/dist/index.min.css")
        }

        if (this.vuexVersion != null) {
            injectSucc = await this.injector.dynamicInject("vuex", this.vuexVersion, "/dist/vuex.global.min.js", 5000, () => {
                if (typeof Vuex != 'undefined') {
                    app.vuex = Vuex
                    app.logger.info("Vuex %s Loaded.", app.vuex.version)
                    return true
                }
            })
            if (!injectSucc) return injectSucc
        }

        return true
    }

    async dynamicInjectOptions(url, checkLoadedCallback = undefined) {
        if (checkLoadedCallback == undefined) {
            let app = this
            checkLoadedCallback = () => {
                let loaded = 0
                if (typeof appNodeId != 'undefined') {
                    app.appNodeId = appNodeId
                    loaded++
                }
                if (typeof vueAppOptions != 'undefined') {
                    app.vueOptions = vueAppOptions
                    loaded++
                }
                if (typeof storeOptions != 'undefined') {
                    app.storeOptions = storeOptions
                    loaded++
                }
                if (typeof injectStyles != 'undefined') {
                    app.injectStyles = injectStyles
                    loaded++
                }
                return loaded > 0
            }
        }

        let injectSucc = await this.injector.dynamicInjectByUrl(url, 5000, checkLoadedCallback)
        return injectSucc
    }

    async createVueApp(optionsUrl) {
        let injectSucc = await this.dynamicInjectVue()
        if (!injectSucc) return false

        injectSucc = await this.dynamicInjectOptions(optionsUrl)
        if (!injectSucc) return false
        
        let appNode = document.getElementById(this.appNodeId)
        if (appNode == null) {
            appNode = document.createElement("div")
            appNode.id = this.appNodeId
            document.body.appendChild(appNode)
        }
        // TODO 添加样式

        let app = this.vue.createApp(this.vueOptions)
        
        if (this.element != null) {
            app.use(this.element)
            // TODO message
        }

        if (this.storeOptions != null) {
            let store = this.vuex.createStore(this.storeOptions)
            app.use(store)
        }

        app.mount(`#${this.appNodeId}`)

        this.vueApp = app
        return true
    }

    async start() {
        this.createVueApp(this.optionsUrl)
    }
}