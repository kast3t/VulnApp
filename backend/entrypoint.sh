#!/bin/sh

gunicorn --bind 0.0.0.0:5000 app:app &

if [ ! -d "/backend/migrations" ]; then
    sleep 5
    python3.12 /backend/manage.py
fi

wait