FROM python:3.12-alpine
WORKDIR /backend
COPY ./backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY ./backend ./
EXPOSE 5000
COPY ./entities/txt ./entities/txt
ENTRYPOINT ["sh", "entrypoint.sh"]