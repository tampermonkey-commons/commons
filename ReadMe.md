# TamperMonkey UserScript Commons

## 组件

### Logger 日志

调用`console.log`等函数，不使用`GM_log`，会输出时间，需要添加对`console.trace`的支持

### Config 配置读写

对`GM_getValue`等函数进行封装，目前不好用

### JSON-RPC WebSocket 客户端

目前唯一的用途是用于实现Aria2客户端

### Aria2 客户端

基于`JsonRpcWebSocketClient`实现的Aria2客户端

### DynamicInjector 动态注入

通过往unsafeWindow的body尾部添加`<script>`标签的方式动态加载js库，可以自行实现回调函数以检查加载是否加载完成

也可以用来注入css，在head尾部添加`<link>`标签，可以不用等待加载完成

默认使用`jsdelivr`这个CDN，只需要输入包名、版本号与路径，会自动拼接URL

### Skeleton 骨架

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 默认值 `GM_info.script.name` |
| version | string | 默认值 `GM_info.script.version` |
| url | string |  |
| vue | string | Vue版本，不填不加载Vue |
| element | string | Element Plus版本，不填不加载Element Plus |
| vuex | string | Vuex版本，不填不加载Vuex |
| appNodeId | string | vue的app挂载节点 |
| template | string | app挂载节点HTML，如果没有就创建一个空div |
| styles | string | 添加的样式 |
| appOptions | object | Vue的Options |
| storeOptions | object | Vuex的Options |
