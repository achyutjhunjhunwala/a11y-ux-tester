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
npm run start
```
#### Using the App
Via Postman -

1 URL, multiple URL can be added to array. Only GLASS URLs
```

url - http://localhost:8080/queue-markets
method - POST
Payload - {"list": [{"url":"https://adidas.de"}], "resolution": {"x": 1200, "y": 1080}}
Type - RAW (Application/JSON)
```
=======
