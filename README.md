## A11y UX Testing Project

Features:

- Ability to test readability of Button Text on a Webpage

Technical Features:
- Babel support with node environment
- Logging
- Testing with Jest
- Airbnb eslint
- Hooks for commits and push to maiantain code quality.

#### Install
```
yarn
```
#### Development
```
npm run serve
```
#### Debug
Uses chrome inspect flag for debugging.
```
npm run serve:debug
```
#### Testing
```
npm run test
```
#### Build
```
npm run build
```
#### Running Build Version Locally
```
cd dist/
node index.js
```

#### Using Docker
```

docker build -t a11y-ux-tester .

Check Docker Compose File

docker-compose up
```

#### Running Locally Vs Running on Docker

Chromium has issues running inside a Node Alpine Image
So the way it works is, 

It needs Chromium to run in 1 container and the app in different and it connects via Web Sockets

Check this comment here
https://github.com/achyutjhunjhunwala/a11y-ux-tester/blob/develop/lib/services/scrape-markets/scrapeMarkets.js#L23

You need to comment out code to run browser via Websocket in case you are running locally
When running using Docker-compose, you need to use WS


#### Using the App
Via Postman -

1 URL, multiple URL can be added to array. Only GLASS URLs
```
url - http://localhost:8080/queue-markets
method - POST
Payload - {"url":"https://adidas.de", "resolution": {"x": 375, "y": 667}}
Type - RAW (Application/JSON)
```

#### Credits

* **Andrew Brandwood** - *A11y Text Over Image Contrast Logic* - [Andrewbrandwood](https://github.com/andrewbrandwood)
* **Sai Baba Satchitanand** - *Node Seed* - [Saibs](https://github.com/saibs)
