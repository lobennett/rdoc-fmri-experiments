#!/bin/bash

# Create virtual environment
if [ ! -d ".venv" ]; then
    python3 -m venv .venv && source .venv/bin/activate && pip install pandas
else
    source .venv/bin/activate
fi

# Run scripts
cd src && python3 create.py && python3 move.py

deactivate