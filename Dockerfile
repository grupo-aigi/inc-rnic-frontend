FROM node:22.5.1-alpine AS build-stage

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . .

RUN npm run build --verbose

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/red-nacional-inv-cancer/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]