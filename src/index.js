import Logger from './Logger'
import Aria2Client from './Aria2Client'

let logger = new Logger("root")

async function main() {
    let aria2client = new Aria2Client("aria2-client", "ws://127.0.0.1:6800/jsonrpc", "47bfbcf3")
    let duration = await aria2client.createWebSocket()
    logger.info("Aria2 连接成功，耗时 %d ms", duration)
    aria2client.getVersion()
}

main()
