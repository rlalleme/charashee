FROM node:11.13.0-stretch

RUN npm i websocket-stream aedes uuid http express fs https

COPY charashee /src/charashee
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]