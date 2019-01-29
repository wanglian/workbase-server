![WorkBase logo](https://www.weaworking.com/assets/workbase.png)

# workbase-server snap for Ubuntu Core  (all arch)

Features:
* bundles ubuntu distribution specific and RC compatible mongodb version
* oplog tailing for mongo by default
* mongodb backup command  
* mongodb restore command
* caddy reverse proxy built-in - capable of handling free lestencrypt ssl

Note:

Currently, this repository is mirrored on launchpad, and used to build latest ARMHF and i386 snaps.   

You can download recent builds here:
https://code.launchpad.net/~sing-li/+snap/workbase-server


### Test installation 

Download the latest snap file of the corresponding architecture to your Ubuntu Core 16 or 16.04LTS server.

`sudo snap install ./workbase-server-xxxxxxxx.snap  --dangerous`


### Development or compile your own snap

Make sure you have `snapcraft` installed.

```
git clone https://github.com/wanglian/workbase-server-snap
cd workbase-server-snap
snapcraft snap
```
