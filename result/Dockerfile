FROM node:16-alpine

RUN apk update && \
    apk upgrade && \
    apk add --update-cache --upgrade tini && \
    rm -rf /var/cache/apk/*

WORKDIR /app

RUN npm install --global nodemon

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --pure-lockfile && \
    mv /app/node_modules /node_modules


COPY [".", "."]

EXPOSE 80

CMD ["tini", "--", "node", "server.js"]
