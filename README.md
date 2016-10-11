# Serverless Thumbnails
Serverless Service that takes an image url and returns a 100x100 thumbnail.

## Usage

1. `serverless install --url https://github.com/eahefnawy/serverless-thumbnails`
2. `cd serverless-thumbnail`
3. `npm install`
4. set env var locally and for lambda:
   - Local: `export THUMBNAILS_BUCKET=BUCKET_NAME`
   - Lambda: Add it to `.env` file
5. `serverless deploy`
6. add a url to an image bigger than 100x100 in `event.json` for testing
7. `serverless invoke -f thumbnail -p event.json`
8. Have fun!


