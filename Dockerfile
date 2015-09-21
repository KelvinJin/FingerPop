FROM mwallasch/docker-ruby-node

COPY . /FingerPop

# Start server first
WORKDIR /FingerPop/Server
RUN bundle install

# Start socket manager
WORKDIR /FingerPop/SocketManager
RUN npm install
RUN npm install socket.io

WORKDIR /FingerPop
RUN chmod +x start.sh

CMD ./start.sh
