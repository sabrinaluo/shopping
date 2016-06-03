# shopping-server [![Build Status](https://travis-ci.org/sabrinaluo/shopping.svg?branch=master)](https://travis-ci.org/sabrinaluo/shopping)
Demo: https://shopping-sab.herokuapp.com

Note: Due to heroku app [sleepping policy](https://blog.heroku.com/archives/2013/6/20/app_sleeping_on_heroku), you may need to wait for few seconds until the app wakes up.

## Quick Start
Before start

1. Edit `config/develop.json` and `config/production.json`
2. Create database schema
3. Set `NODE_ENV` to `develop` / `production`
4. (optional) If what you want is not only API server, but also frontend, you can:
  - Clone [shopping-client](https://github.com/sabrinaluo/shopping-client)
  - Build and cpoy `shopping-client/dist/*` into `shopping/public`

```
npm install
npm start
```

## Dev
```
gulp
```

## Test
```
npm test
```
Generate coverage report
```
npm test:cov
```

## API
Root: /api

|URL|Method|Query|description|
|:--|:--|:--|:--|
|/product|`GET`|brand_id|Lastest products (max count 10)|
|/product/:productId|`GET`||product detail|
|/review|`POST`||Add a new review|

## Schema
You can use `schema.sql` to create a `shopping` schema

![schema](https://cloud.githubusercontent.com/assets/5300359/15782805/36f17be4-29de-11e6-9e17-ac267343aa7f.png)

## Continous Integration - Travis
Integrated with Travis, this app is tested, built, deployed to heroku automatically.

For details, see `.travis.yml`
