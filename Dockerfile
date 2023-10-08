FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY . ./
RUN yarn && yarn build

FROM nginx:alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY --from=build /app/assets/ /usr/share/nginx/html/assets/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
