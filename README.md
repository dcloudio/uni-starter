<h2>
文档已移至 <a href="https://uniapp.dcloud.io/uniCloud/uni-starter.html" target="_blank">uni-starter文档</a>
</h2>

## 常见问题

1. 报错 `Error: Invalid uni-id config file`

	创建并配置uni-id的配置文件，在目录	`uniCloud/cloudfunctions/common/uni-config-center/` 下新建 `uni-id/config.json` ， [参考文档云端配置config.json的说明完成配置](https://doc.dcloud.net.cn/uniCloud/uni-id/summary.html#config)

2. 报错 `onDBError {code: "SYSTEM_ERROR", message: "Config parameter missing, tokenSecret is required"}`

	在目录 `uniCloud/cloudfunctions/common/uni-config-center/uni-id/config.json` 中配置tokenSecret，参考文档[https://doc.dcloud.net.cn/uniCloud/uni-id/summary.html#config](https://doc.dcloud.net.cn/uniCloud/uni-id/summary.html#config)