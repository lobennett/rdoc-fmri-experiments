#!/bin/bash

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate
pip install pandas

# Run scripts
cd src
python3 create.py && python3 move.py

deactivate