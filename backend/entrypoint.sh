#!/bin/sh

# БД пересоздаётся и заполняется заново при каждом старте контейнера (в т.ч. после перезагрузки ВМ).
# После перезагрузки Docker не соблюдает depends_on, поэтому БД может быть ещё не готова: повторяем попытки
for attempt in $(seq 1 30); do
    rm -rf /backend/migrations
    python3.12 /backend/manage.py && break
    echo "manage.py failed (attempt $attempt/30), retrying in 2s..."
    sleep 2
done

exec gunicorn --bind 0.0.0.0:5000 app:app
