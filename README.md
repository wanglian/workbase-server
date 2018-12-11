# WeWork

## Run

```
meteor npm install
meteor
```
access from http://localhost:3000
account: admin@test.com / admin123

## Docker

```
docker build -t wanglian/wework . // build
docker push wanglian/wework:latest // push to docker hub
docker pull wanglian/wework:latest // server: pull image
```

启动
```
docker run -d \
  -e ROOT_URL=<> \
  -e MONGO_URL=<mongodb://url> \
  -e MONGO_OPLOG_URL=<mongodb://oplog_url> \
  -e HTTP_FORWARDED_COUNT=1 \
  -e CLUSTER_WORKERS_COUNT=auto \
  -e METEOR_SETTINGS="$(cat settings.json)" \
  -p 80:3000 \
  --link <mongodb> \
  --name <docker instance name> \
  --restart always \
  wanglian/wework:latest
```