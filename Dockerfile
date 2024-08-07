# 빌드 단계
FROM node:20-alpine3.19 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm react-scripts build
# 프로덕션 단계
FROM nginx:stable-alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 앱을 Nginx의 서비스 디렉토리로 복사합니다
COPY --from=build /app/build /usr/share/nginx/html

# 80번 포트를 엽니다
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
