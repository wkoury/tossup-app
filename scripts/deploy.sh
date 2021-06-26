#!/bin/sh

# ONLY RUN THIS SCRIPT FROM THE ROOT DIRECTORY

set -o allexport; source .env; set +o allexport

if [[ -z "${DEPLOY_ADDRESS}" ]]; then
	echo "DEPLOY_ADDRESS does not exist in .env"
	exit 1
fi

echo "Deploying to $DEPLOY_ADDRESS."

ssh -A $DEPLOY_ADDRESS "$(cat scripts/update.txt)"

curl -L tossupapp.com
# Above is to test that the site is still alive.