#!/bin/bash

mkdir -p openapi

echo "Downloading API spec..."
curl -s -o openapi/access-token.yaml https://developer.vippsmobilepay.com/redocusaurus/access-token-swagger-id.yaml
curl -s -o openapi/epayment.yaml https://developer.vippsmobilepay.com/redocusaurus/epayment-swagger-id.yaml
curl -s -o openapi/webhooks.yaml https://developer.vippsmobilepay.com/redocusaurus/webhooks-swagger-id.yaml
