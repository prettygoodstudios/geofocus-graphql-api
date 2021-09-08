# syntax=docker/dockerfile:1

FROM node:15.5.1
ENV NODE_ENV=production

WORKDIR /app
RUN npm install nodemon --global
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production
COPY [".env", ".env", "./"]

CMD ["npx", "nodemon", "dist/index.js"]
