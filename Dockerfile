# 빌드 단계
FROM node:20 AS build
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm cache clean --force && npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN chown -R node:node .
USER node
RUN npm run build

# 프로덕션 단계
FROM nginx:stable-alpine
# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 빌드된 React 앱을 Nginx의 서비스 디렉토리로 복사합니다
COPY --from=build /app/build /usr/share/nginx/html
# 80번 포트를 엽니다
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
