FROM node:9-alpine

MAINTAINER Jhunjhunwala, Achyut <achyut.jhunjhunwala@gmail.com>

COPY . src/

WORKDIR src/

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm i

RUN npm run build

RUN apk add --no-cache curl

EXPOSE 8080 3000

CMD [ "node", "dist/index.js" ]
