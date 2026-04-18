#!/bin/bash

# Vipps MobilePay OpenAPI download script

mkdir -p docs/openapi

echo "Downloading Access Token API spec..."
curl -s -o docs/openapi/access-token.yaml https://developer.vippsmobilepay.com/redocusaurus/access-token-swagger-id.yaml

echo "Downloading ePayment API spec..."
curl -s -o docs/openapi/epayment.yaml https://developer.vippsmobilepay.com/redocusaurus/epayment-swagger-id.yaml

echo "Downloading Webhooks API spec..."
curl -s -o docs/openapi/webhooks.yaml https://developer.vippsmobilepay.com/redocusaurus/webhooks-swagger-id.yaml

echo "OpenAPI specifications downloaded to docs/openapi/"
