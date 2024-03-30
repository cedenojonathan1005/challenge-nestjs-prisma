FROM node:18-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm i
CMD ["npm", "run", "start:dev"]
