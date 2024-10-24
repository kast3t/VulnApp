# Build окружение
FROM node:20.18.0-alpine AS build
WORKDIR /app
COPY ./nginx-frontend ./
COPY ./entities/img ./public/img
RUN npm install --omit=dev
RUN npm run build

# Prod окружение
FROM nginx:1.27.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx-frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]