const sleep = ms => new Promise(res => setTimeout(res, ms))
const defaultCDN = "https://cdn.jsdelivr.net/npm"

async function dynamicInjectByUrl(url, interval = 10, checkLoaded = undefined) {
    let element = null
    if (url.endsWith(".js")) {
        element = document.createElement("script")
        element.src = url
        document.body.appendChild(element)
    }
    else if (url.endsWith(".css")) {
        element = document.createElement("link")
        element.href = url
        element.rel = "stylesheet"
        document.head.appendChild(element)
    }

    let loaded = false
    let lib = null
    do {
        await sleep(interval)
        if (checkLoaded != undefined) {
            lib = checkLoaded()
            loaded = lib != null
        }
        else {
            loaded = true
        }
    }
    while (!loaded)
    return lib
}

async function dynamicInjectFromCDN(
    package, 
    path, 
    version = undefined, 
    baseUrl="https://cdn.jsdelivr.net/npm", 
    interval = 10, 
    checkLoaded = undefined
) {
    let packageWithVersion = package
    if (version != null && version.trim() != "") {
        packageWithVersion += `@${version}`
    }
    let url = `${baseUrl}/${packageWithVersion}${path}`
    return await dynamicInjectByUrl(url, interval, checkLoaded)
}

async function dynamicInject(
    package, 
    path, 
    version = undefined, 
    checkLoaded = undefined
) {
    return await dynamicInjectFromCDN(
        package, 
        path, 
        version, 
        defaultCDN, 
        10, 
        checkLoaded
    )
}

function createVueApp(appNodeId, vue, vueOptions, elementPlus, vuex, storeOptions) {
    if (vueOptions == null) {
        return null
    }

    let app = vue.createApp(vueOptions)
    app.use(elementPlus)
    app.provide('$message', elementPlus.ElMessage)

    if (storeOptions != null) {
        let store = vuex.createStore(storeOptions)
        app.use(store)
    }

    app.mount(`#${appNodeId}`)
    return app
}

async function dynamicInjectVue(appNodeId, vueOptions, storeOptions) {
    let appNode = document.getElementById(appNodeId)
    if (appNode == null) {
        appNode = document.createElement("div")
        appNode.id = appNodeId
        document.body.appendChild(appNode)
    }

    const vueVersion = "3.2"
    const elementPlusVersion = "2.3"
    const vuexVersion = "4.1"

    let vue = await dynamicInject("vue", "/dist/vue.global.prod.js", vueVersion, function() {
        if (typeof Vue != 'undefined') {
            let vue = Vue
            console.log(`Vue ${vue.version} Loaded`)
            return vue
        }
        return null
    })

    let elementPlus = await dynamicInject("element-plus", "/dist/index.full.min.js", elementPlusVersion, function() {
        if (typeof ElementPlus != 'undefined') {
            let ep = ElementPlus
            console.log(`Element Plus ${ep.version} Loaded`)
            return ep
        }
        return null
    })

    dynamicInject("element-plus", "/dist/index.min.css", elementPlusVersion)

    let vuex = await dynamicInject("vuex", "/dist/vuex.global.min.js", vuexVersion, function() {
        if (typeof Vuex != 'undefined') {
            let vuex = Vuex
            console.log(`Vuex ${vuex.version} Loaded`)
            return vuex
        }
        return null
    })

    let app = createVueApp(
        appNodeId, 
        vue, 
        vueOptions, 
        elementPlus, 
        vuex,
        storeOptions
    )
    return app
}