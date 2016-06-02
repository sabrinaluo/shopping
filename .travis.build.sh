#!/bin/sh -vx
cd ..
git clone --depth=50 --branch=master https://github.com/sabrinaluo/shopping-client.git shopping-client
cd shopping-client && npm install && npm run build
cp -r dist/* ../shopping/public
