export default class Skeleton {
    constructor(options) {
        this.logger = new Logger(this.name)
        this.injector = new DynamicInjector()

        this.name = (options.name != null) ? options.name : GM_info.script.name
        this.version = (options.version != null) ? options.version : GM_info.script.version
        this.optionsUrl = (options.url != null) ? options.url : null

        this.vueVersion = (options.vue != null) ? options.vue : null
        this.elementVersion = (options.element != null) ? options.element : null
        this.vuexVersion = (options.vuex != null) ? options.vuex : null

        this.reloadOptions(options)
        
        this.vue = null
        this.element = null
        this.vuex = null
        this.vueApp = null
    }

    async dynamicInjectVueComponents() {
        let injectSucc = false
        let app = this

        if (this.vueVersion != null) {
            injectSucc = await this.injector.dynamicInject("vue", this.vueVersion, "/dist/vue.global.prod.js", 5000, () => {
                if (typeof Vue != 'undefined') {
                    app.vue = Vue
                    app.logger.info("Vue %s 加载完成", app.vue.version)
                    return true
                }
            })
            if (!injectSucc) return injectSucc
        }

        if (this.elementVersion != null) {
            injectSucc = await this.injector.dynamicInject("element-plus", this.elementVersion, "/dist/index.full.min.js", 5000, () => {
                if (typeof ElementPlus != 'undefined') {
                    app.element = ElementPlus
                    app.logger.info("Element Plus %s 加载完成", app.element.version)
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
                    app.logger.info("Vuex %s 加载完成", app.vuex.version)
                    return true
                }
            })
            if (!injectSucc) return injectSucc
        }

        return true
    }

    async dynamicInjectOptions(url, checkLoadedCallback = undefined) {
        if (checkLoadedCallback == undefined) {
            checkLoadedCallback = this.checkOptionsLoadedCallback
        }

        let injectSucc = await this.injector.dynamicInjectByUrl(url, 5000, checkLoadedCallback)
        return injectSucc
    }

    checkOptionsLoadedCallback() {
        if (typeof skeletonOptions != 'undefined') {
            this.reloadOptions(skeletonOptions)
            return true
        }
        return false
    }

    reloadOptions(skeletonOptions) {
        this.appNodeId = (skeletonOptions.appNodeId != null) ? skeletonOptions.appNodeId : null
        this.template = (skeletonOptions.template != null) ? skeletonOptions.template : null
        this.styles = (skeletonOptions.styles != null) ? skeletonOptions.styles : null
        this.storeOptions = (skeletonOptions.storeOptions != null) ? skeletonOptions.storeOptions : null
        this.appOptions = (skeletonOptions.appOptions != null) ? skeletonOptions.appOptions : null
    }

    async createVueApp(optionsUrl) {
        let injectSucc = await this.dynamicInjectVue()
        if (!injectSucc) return false

        if (optionsUrl != null) {
            injectSucc = await this.dynamicInjectOptions(optionsUrl)
            if (!injectSucc) return false
        }

        // 注入app节点
        let appNode = null
        if (this.template != null) {
            appNode = document.createElement("div")
            appNode.outerHTML = this.template
            document.body.appendChild(appNode)
        }
        
        // 再检查一次，如果没有就创建一个空的
        appNode = document.getElementById(this.appNodeId)
        if (appNode == null) {
            appNode = document.createElement("div")
            appNode.id = this.appNodeId
            document.body.appendChild(appNode)
        }

        // 注入app样式
        if (this.styles != null) {
            GM_addStyle(this.styles)
        }

        let app = this.vue.createApp(this.vueOptions)
        
        if (this.element != null) {
            app.use(this.element)
            app.provide('$message', element.ElMessage)
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