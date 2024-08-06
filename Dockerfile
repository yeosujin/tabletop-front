# 베이스 이미지로 Node.js 20.10을 사용합니다
FROM node:20.10 as build

# 작업 디렉토리를 설정합니다
WORKDIR /app

# 패키지 파일들을 복사합니다
COPY package*.json ./

# 의존성을 설치합니다
RUN npm install

# 소스 코드를 복사합니다
COPY . .

# React 앱을 빌드합니다
RUN npm run build

# Nginx 스테이지
FROM nginx:alpine

# Nginx 설정 파일을 복사합니다
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 앱을 Nginx의 서비스 디렉토리로 복사합니다
COPY --from=build /app/build /usr/share/nginx/html

# 80번 포트를 엽니다
EXPOSE 80

# Nginx를 시작합니다
CMD ["nginx", "-g", "daemon off;"]
