#!/usr/bin/env bash
# exit on error
set -o errexit

cd server
pip install -r requirements.txt
python database.py
