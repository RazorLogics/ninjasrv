# Sanctions Screener

## Deployment
gcloud beta functions deploy fetch-un-sanctions \
--gen2 \
--runtime nodejs16 \
--trigger-topic fetch-un  \
--entry-point fetchUN \
--source . \
--allow-unauthenticated

## Test in the cloud:
gcloud pubsub topics publish  --message 'MyMessage'

curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/index_list2?list=ec_europa_eu__sanctions_list" -d '[{"field":"nameAlias", "type":"array","subField":"wholeName"}]'


curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/screen?target=test"


curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/test?test_parameter=hello" -d '{"test_json":"Hello World!"}'
