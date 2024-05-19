<img src="./assets/logo.webp" width="200" />

# EasyVerify

EasyVerify 是一个基于 Node.js 和 Redis 的开源邮件验证码服务，提供发送和校验验证码的功能。

## 功能

- 生成并发送验证码到指定邮箱
- 验证用户输入的验证码是否正确
- 可配置的验证码有效期

## 配置

在根目录创建一个 .env.local 环境变量，配置以下内容

```env
EMAIL_SERVICE=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_SEND_NAME=
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
CODE_EXPIRE_TIME=120
```

## 使用

```shell
cd verify-code
yarn install
```

## 启动

```shell
yarn dev
```

## API 文档
### 1. 发送验证码

请求

方法：POST

路径：/send-code

参数：

- email (string): 接收验证码的邮箱地址
- username (string): 用户名称（非必填）

示例
```bash
curl -X POST http://localhost:3000/send-code -d "email=example@example.com"
```

### 2. 校验验证码

请求

方法：POST

路径：/verify-code

参数：
email (string): 接收验证码的邮箱地址
code (string): 用户输入的验证码

示例

```bash
curl -X POST http://localhost:3000/verify-code -d "email=example@example.com&code=123456"
```

## 贡献
欢迎贡献代码！请提交 Pull Request 或报告问题到 issues。

## 许可证
本项目使用 MIT 许可证。请参阅 LICENSE 文件了解更多信息。