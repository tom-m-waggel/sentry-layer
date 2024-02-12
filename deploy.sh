cd sentry-lambda-extension
npm install
npm run build
chmod +x index.js
cd -

chmod +x extensions/sentry-lambda-extension

archive="extension.zip"
if [ -f $archive ] ; then
    rm $archive
fi

zip -r $archive ./sentry-lambda-extension/index.js
zip -r $archive ./extensions

aws lambda publish-layer-version \
 --layer-name "sentry-lambda-extension" \
 --region eu-west-2 \
 --zip-file  "fileb://extension.zip"