# 빌드 단계
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ARG REACT_APP_EMAIL_VALIDATION_API_KEY
ENV REACT_APP_EMAIL_VALIDATION_API_KEY=$REACT_APP_EMAIL_VALIDATION_API_KEY
ARG REACT_APP_PHONE_VALIDATION_API_KEY
ENV REACT_APP_PHONE_VALIDATION_API_KEY=$REACT_APP_PHONE_VALIDATION_API_KEY
RUN npm run build

# 프로덕션 단계
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]