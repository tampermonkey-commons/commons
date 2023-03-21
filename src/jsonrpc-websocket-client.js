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
        this.version = "0.6.0"
        this.name = name
        this.url = url
        this.webSocket = null
        this.logger = new Logger("jsonrpc-wsc")
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

