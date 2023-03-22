import { 
    JsonRpcRequest as Request, 
    JsonRpcWebSocketClient as JRWSClient
} from "./JsonRpcWebSocketClient"

export default class Aria2Client extends JRWSClient {
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
        let req = new Request(method, params, id)
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