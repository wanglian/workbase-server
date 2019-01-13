# Amazon EC2

Ubuntu 16.04

##  TimeZone

https://help.ubuntu.com/community/UbuntuTime#Using_the_Command_Line_.28terminal.29

```
sudo dpkg-reconfigure tzdata
```
America/Toronto

## Install Docker

https://docs.docker.com/install/linux/docker-ce/ubuntu/
```
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update
sudo apt-get install docker-ce

docker run hello-world # 验证
sudo usermod -a -G docker $USER // fix permission
```

## MongoDB

```
// https://hub.docker.com/_/mongo/
docker pull mongo:3.6
docker run --name mongo -d mongo:3.6 // run
docker exec -it mongo mongo // connect
```

## Nginx + Mechanic

```
sudo apt-get install nginx
// 安装nodejs/npm
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy
// 确认nodejs和npm是最新版本
sudo npm config set strict-ssl false
sudo npm install -g n
sudo n stable
n
sudo npm install npm@latest -g
// 安装mechanic
sudo npm install mechanic -g --unsafe-perm
// 配置nginx负载均衡
// https://github.com/punkave/mechanic
mechanic add weaworking --host=weaworking.com
mechanic update weaworking --backends=3001,3002
mechanic refresh

// 配置nginx sticky session
sudo vi /etc/nginx/conf.d/mechanic.conf
upstream upstream-weaworking {
  ip_hash;
}
```

http://nginx.org/en/docs/http/websocket.html

这个没有配置，不确定什么情况下需要。

```
map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
}

server {
        ...

        location /chat/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
        }
}
```

## SSL

```
// 将两个证书copy到/etc/nginx/目录下
// 修改文件 /etc/nginx/conf.d/mechanic.conf
server { // 添加80端口配置
  listen *:80;
  server_name xxx.com;
  // 强制转到https
  rewrite ^ https://$server_name$request_uri? permanent;
}
server { // 将原80端口配置改为ssl配置
  …
  listen *:443 ssl;
  server_name xxx.com;
  ssl_certificate xxx.crt;
  ssl_certificate_key xxx.key;
  ...
}
// 注意打开EC2端口443
```

## Mailgun

```
Match Recipient: (.*)@weaworking.com
Forward: http://www.weaworking.com/api/v1/mailgun
```

## Run App

```
docker run -d \
  -e ROOT_URL=http://www.weaworking.com \
  -e MONGO_URL=mongodb://mongo:27017/wework \
  -e MONGO_OPLOG_URL=mongodb://mongo/local \
  -e HTTP_FORWARDED_COUNT=1 \
  -e CLUSTER_WORKERS_COUNT=auto \
  -p 3001:3000 \
  --link mongo \
  --name wework \
  --restart always \
  wanglian/wework:latest
```

## 问题

- MONGO__OPLOG__URL配置启动不成功
```
Error: $MONGO_OPLOG_URL must be set to the 'local' database of a Mongo replica set
```