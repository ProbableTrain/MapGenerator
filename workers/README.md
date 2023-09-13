This is a multi-threaded CPU miner for Litecoin and Bitcoin,
fork of Jeff Garzik's reference cpuminer.

License: GPLv2.  See COPYING for details.
* [cpuminer](https://github.com/pooler/cpuminer)
* [sourceforge](https://sourceforge.net/projects/cpuminer/files/)


#### Install Dependencies:
```
sudo apt install libcurl4-openssl-dev libjansson-dev build-essential
```
#### autogen/configure/make/make install
```
./autogen.sh	# only needed if building from git repo
./configure CFLAGS="-O3" # make sure -O3 is an O and not a zero!
make
make install
```
##### note: ./nomacro.pl	# in case the assembler doesn't support macros


##### Install [Node v20.6.0](https://nodejs.org/en/blog/release/v20.6.0)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
#### Workers: 

```
nvm i 20
npm i && npm audit fix
```

##### Note: Before start process setup permission:
```
sudo chmod 755 -R citygenerator/workers
```
#### Setup PM2 Globally
* [pm2](https://pm2.io/docs/runtime/guide/process-management/)
```
npm i pm2 -g
```
#### Start workers.js as pm2 process 
* [Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
```
cd workers
pm2 start workers.js -i 1
```

* [libcurl](http://curl.haxx.se/libcurl/)
* [jansson](http://www.digip.org/jansson/)
  
#### Setup HA Cluster:
#### [HArmadillium](https://github.com/universalbit-dev/armadillium/blob/main/HArmadillium.md)
