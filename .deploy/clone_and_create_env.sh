#!/bin/bash

# Script to setup virtual environment and expfactory_deploy_local for the first time 

# Clone expfactory_deploy_local
git clone https://github.com/lobennett/expfactory-deploy.git

# Create virtual environment - using python3 because of web.py dependency
python3 -m venv .venv && source .venv/bin/activate && pip3 install -e ./expfactory-deploy/expfactory_deploy_local

pip3 list

# Ensure virtual environment contains expfactory_deploy_local
if ! pip3 show expfactory_deploy_local > /dev/null; then
  echo "expfactory_deploy_local is not installed in the virtual environment."
  exit 1
fi

# Copy over all custom plugins to expfactory_deploy_local
cp ../.utils/*.js ./expfactory-deploy/expfactory_deploy_local/src/expfactory_deploy_local/static/jspsych7/poldrack-plugins/

echo "---------------------------------------------------------------"
echo "If you see expfactory_deploy_local in the list, you're all set."
echo "Run `./run.sh` in the root of the project and it will prompt you for the session's metadata and then run the experiment."
echo "The experiment will be available at: http://localhost:8000/"
echo "---------------------------------------------------------------"
