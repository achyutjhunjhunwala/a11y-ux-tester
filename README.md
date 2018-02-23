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


#### Running on Centos7+

* sudo yum install epel-release

* Install Node - 
  - curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
  - sudo yum install nodejs
  - yum install -y gcc-c++ make
  
* sudo yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y

* sudo yum install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

* sudo npm install pm2 -g

#### Jenkins Deployment

* cd /home/centos/a11y/
* pm2 stop all
* rm -rf *
* SCM Checout Code on the box /a11y here
* npm install
* npm run build
* pm2 start processes.json --no-daemon
