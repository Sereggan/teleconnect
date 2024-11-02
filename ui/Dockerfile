FROM node:22.11.0-slim
WORKDIR /app
COPY package.json .

RUN yarn install

COPY . .

EXPOSE 3000
CMD ["yarn", "dev"]