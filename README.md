# FingerPop
Finger pop is a multiplayer online word guessing game which runs from browser. It currently has four implementaions with different architecture which are:

* central server
* distributed client without lock
* distributed client with central lock
* distributed client with ring lock

source code of each implementation can be checked out from the corresponding branch

## Getting Started

### Step 1. Install node.js

### Step 2. Install ruby 2.2+

### Step 3. Install ruby gems
under 'Server' folder of the source code, run the following command
```
bundle install 
```
### Step 4. Install node packages
under 'SocketManager' folder of the source code, run the following commands
```
npm install 
npm install peer
npm install socket.io
```
### Step 5. Run server
```
rm /tmp/server
cd Server
ruby finger_pop.rb
cd ..
cd SocketManager
node app.js
```
Then the server will be running at localhost:3333
