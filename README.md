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
#### Deployment
```
npm run build
```

#### Deployment using Docker
Make Sure environment variables are set on the running env
```
docker build --build-arg AWS_ACCESS_KEY_ID={AWS_KEY} --build-arg AWS_SECRET_ACCESS_KEY={AWS_SECRET} -t a11y-ux-tester .
docker run -p 8080:8080 -h 127.0.0.1 -d  a11y-ux-tester
```
#### Running Prod Version
```
cd dist/
node index.js
```

#### Running on Server

This app uses Amazon SQS for queue management.
2 ENV variables should be present

1. AWS_ACCESS_KEY_ID
2. AWS_SECRET_ACCESS_KEY

#### Using the App
Via Postman -

1 URL, multiple URL can be added to array. Only GLASS URLs
```

url - http://localhost:8080/queue-markets
method - POST
Payload - {"list": [{"url":"https://adidas.de"}], "resolution": {"x": 1200, "y": 1080}}
Type - RAW (Application/JSON)
```

