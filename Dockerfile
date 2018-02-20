FROM node:9-alpine

MAINTAINER Jhunjhunwala, Achyut <achyut.jhunjhunwala@gmail.com>

COPY . src/

WORKDIR src/

RUN npm i

RUN npm run build

RUN apk add --no-cache curl

USER nobody

EXPOSE 8080 3000

CMD [ "node", "dist/index.js" ]
