FROM node:lts-alpine

WORKDIR /usr/src/server

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8000
USER node
RUN mkdir dist
CMD ["npm", "run", "start:prod"]