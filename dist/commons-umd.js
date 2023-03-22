(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TmUsCommons"] = factory();
	else
		root["TmUsCommons"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Logger)
/* harmony export */ });
class Logger {
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

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Config)
/* harmony export */ });
class Config {
    constructor(name = "config") {
        this.name = name
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

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DynamicInjector)
/* harmony export */ });
/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


class DynamicInjector {
    constructor() {
        this.defaultCDN = "https://cdn.jsdelivr.net/npm/"
        this.logger = new _Logger__WEBPACK_IMPORTED_MODULE_0__["default"]("dynamic-injector")
    }

    sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

    getFileExtName(str) {
        let url = new URL(str)
        let path = url.pathname
        let index = path.lastIndexOf(".")
        return path.substring(index)
    }

    async dynamicInjectByUrl(url, timeout = 5000, checkLoadedCallback = undefined) {
        let extName = this.getFileExtName(url)
        if (extName == ".js") {
            let element = document.createElement("script")
            element.src = url
            document.body.appendChild(element)
        }
        else if (extName == ".css") {
            let element = document.createElement("link")
            element.href = url
            element.rel = "stylesheet"
            document.head.appendChild(element)
            // css无需等待
            return true
        }
        else {
            this.logger.warn("未识别的资源类型：%s", url)
            return false
        }

        let loaded = false;
        let startAt = new Date()
        do {
            let duration = (new Date()).getTime() - startAt.getTime()
            if (duration >= timeout) {
                this.logger.warn(`动态加载 %s 超时`, url)
                return false
            }
            await this.sleep(10)
            if (checkLoadedCallback != null) {
                loaded = checkLoadedCallback()
                if (loaded) {
                    duration = (new Date()).getTime() - startAt.getTime()
                    this.logger.debug("动态加载 %s 成功，耗时：%d ms", url, duration)
                    return true
                }
            }
            else {
                loaded = true
            }
        }
        while (!loaded)

        return loaded
    }

    async dynamicInjectFromCDN(cdn, pkg, version, path, timeout = 5000, checkLoadedCallback = undefined) {
        let pkgWithVersion = pkg
        if (version != null && version.length > 0) {
            pkgWithVersion += `@${version}`
        }
        let url = `${cdn}${pkgWithVersion}${path}`
        return await this.dynamicInjectByUrl(url, timeout, checkLoadedCallback)
    }

    async dynamicInject(pkg, version, path, timeout = 5000, checkLoadedCallback = undefined) {
        return await this.dynamicInjectFromCDN(this.defaultCDN, pkg, version, path, timeout, checkLoadedCallback)
    }
}

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JsonRpcRequest": () => (/* binding */ JsonRpcRequest),
/* harmony export */   "JsonRpcResponse": () => (/* binding */ JsonRpcResponse),
/* harmony export */   "JsonRpcWebSocketClient": () => (/* binding */ JsonRpcWebSocketClient)
/* harmony export */ });
/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


class JsonRpcRequest {
    constructor(method, params, id) {
        this.jsonrpc = "2.0"
        this.method = method
        this.params = params
        this.id = id
    }
}

class JsonRpcResponse {
    constructor(result, id) {
        this.jsonrpc = "2.0"
        this.result = result
        this.error = null
        this.id = id
    }
}

class JsonRpcWebSocketClient {
    constructor(name, url) {
        this.name = name
        this.url = url
        this.webSocket = null
        this.logger = new _Logger__WEBPACK_IMPORTED_MODULE_0__["default"]("jsonrpc-wsc")
        this.status = "disconnected"
    }

    sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

    async createWebSocket(url = null) {
        if (url == null) {
            url = this.url
        }
        let client = this
        let ws = new WebSocket(url)
        
        ws.addEventListener("open", (event) => {
            client.onOpen(event)
        })

        ws.addEventListener("message", (event) => {
            client.onMessage(
                event.data, 
                event.origin, 
                event.lastEventId,
                event.source, 
                event.ports
            )
        })

        ws.addEventListener("close", (event) => {
            client.onClose(
                event.code,
                event.reason,
                event.wasClean
            )
        })

        ws.addEventListener("error", (event) => {
            client.onError(event)
        })

        this.webSocket = ws

        let startAt = new Date()
        do {
            await this.sleep(10)
        }
        while (this.status != "connected")
        return (new Date()).getTime() - startAt.getTime()
    }

    onOpen(event) {
        this.logger.info("与服务端 %s 连接已建立：" + event, this.name)
        this.status = "connected"
    }

    onMessage(data, origin, lastEventId, source, ports) {
        this.logger.info("写收到来自服务端 %s 的报文 %s", this.name, data)
    }

    onClose(code, reason, wasClean) {
        this.logger.info("与服务端 %s 连接断开，code=%d reason=%s", this.name, code, reason)
    }

    onError(event) {
        this.logger.info("与服务端 %s 通信发生错误：" + event, this.name)
    }
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Aria2Client)
/* harmony export */ });
/* harmony import */ var _JsonRpcWebSocketClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


class Aria2Client extends _JsonRpcWebSocketClient__WEBPACK_IMPORTED_MODULE_0__.JsonRpcWebSocketClient {
    constructor(name, url, token = null) {
        super("aria2-client", url)
        this.token = token
        this.requests = new Map()
        this.eventTarget = new EventTarget()
    }

    createParams(needSecret = true) {
        let secret = null
        if (this.token != null && this.token != "") {
            secret = `token:${this.token}`
        }
        let params = []
        if (needSecret && secret != null) {
            params.push(secret)
        }
        return params
    }

    generateId() {
        return crypto.randomUUID()
    }

    send(method, params, id = null) {
        if (id == null) {
            id = this.generateId()
        }
        let req = new _JsonRpcWebSocketClient__WEBPACK_IMPORTED_MODULE_0__.JsonRpcRequest(method, params, id)
        this.requests.set(id, req)
        this.webSocket.send(JSON.stringify(req))
    }

    getVersion() {
        let method = "aria2.getVersion"
        let params = this.createParams(true)
        this.send(method, params)
    }

    addUri(uris, options = {}, position = null) {
        let method = "aria2.addUri"

        let params = this.createParams(true)
        
        if (typeof uris == 'string') {
            params.push( [ uris ] )
        }
        else if (Array.isArray(uris)) {
            params.push( uris )
        }
        else {
            this.logger.warn("无效的请求参数：uris不是字符串也不是字符串数组")
            return
        }

        params.push(options)

        if (position != null) {
            params.push(position)
        }

        this.send(method, params)
    }
    
    addUriWithOptions(uris, dir, out, proxy, position = null) {
        let options = {}
        if (dir != null) options.dir = dir
        if (out != null) options.out = out
        if (proxy != null) options["all-proxy"] = proxy

        this.addUri(uris, options, position)
    }

    tellStatus(gid, keys = null) {
        let method = "aria2.tellStatus"
        let params = this.createParams(true)
        params.push(gid)
        if (keys != null) {
            params.push(keys)
        }
        
        this.send(method, params)
    }

    tellStatusWithDefaultKeys(gid) {
        let keys = ["gid", "status", "totalLength", "completedLength"]
        this.tellStatus(gid, keys)
    }

    onMessage(data, origin, lastEventId, source, ports) {
        let recvMsg = JSON.parse(data)

        let errorMsg = false
        do {
            if (!recvMsg.hasOwnProperty("jsonrpc")) {
                this.logger.warn("缺少字段jsonrpc，不是JSON-RPC报文")
                errorMsg = true
                break
            }

            if (recvMsg.jsonrpc != "2.0") {
                this.logger.warn("JSON-RPC协议版本不是2.0")
                errorMsg = true
                break
            }

            if (recvMsg.hasOwnProperty("method")) {
                this.onRequest(recvMsg)
            }
            else if (recvMsg.hasOwnProperty("id") || recvMsg.hasOwnProperty("result") || recvMsg.hasOwnProperty("error")) {
                this.onResponse(recvMsg)
            }
            else {
                this.logger.warn("未找到id、result、error等字段")
                errorMsg = true
            }
        }
        while (false)

        if (errorMsg) {
            this.logger.debug("写收到来自服务端 %s 的无效报文：" + recvMsg, this.name)
        }
    }

    onRequest(req) {
        this.logger.debug("接收到请求报文：" + req)
    }

    onResponse(resp) {
        this.logger.debug("接收到响应报文：" + resp)
        if (!this.requests.has(resp.id)) {
            return
        }
        
        let req = this.requests.get(resp.id)
        this.logger.debug("对应的请求报文：" + req)
    }
}

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Skeleton)
/* harmony export */ });
class Skeleton {
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

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Aria2Client": () => (/* reexport safe */ _Aria2Client__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "Config": () => (/* reexport safe */ _Config__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "DynamicInjector": () => (/* reexport safe */ _DynamicInjector__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "JsonRpcRequest": () => (/* reexport safe */ _JsonRpcWebSocketClient__WEBPACK_IMPORTED_MODULE_3__.JsonRpcRequest),
/* harmony export */   "JsonRpcResponse": () => (/* reexport safe */ _JsonRpcWebSocketClient__WEBPACK_IMPORTED_MODULE_3__.JsonRpcResponse),
/* harmony export */   "JsonRpcWebSocketClient": () => (/* reexport safe */ _JsonRpcWebSocketClient__WEBPACK_IMPORTED_MODULE_3__.JsonRpcWebSocketClient),
/* harmony export */   "Logger": () => (/* reexport safe */ _Logger__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "Skeleton": () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _Config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _DynamicInjector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _JsonRpcWebSocketClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _Aria2Client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6);








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});