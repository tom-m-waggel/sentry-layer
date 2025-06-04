#!/bin/bash

sh ./build.sh

aws lambda publish-layer-version \
 --layer-name "sentry-lambda-extension" \
 --region eu-west-2 \
 --zip-file  "fileb://extension.zip"