class DynamicInjector {
    constructor() {
        this.version = "0.5.0"
        this.defaultCDN = "https://cdn.jsdelivr.net/npm/"
        this.logger = new Logger("dynamic-injector")
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