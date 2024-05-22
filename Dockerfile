# 使用官方的 Node.js 16 镜像作为基础镜像
FROM node:16

# 创建应用目录
WORKDIR /usr/src/app

# 复制 package.json 和 yarn.lock 到工作目录
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install

# 复制项目文件到工作目录
COPY . .

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["yarn", "prod:server"]
