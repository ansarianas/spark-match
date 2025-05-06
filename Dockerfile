FROM node:21.7.3-alpine

WORKDIR /dist

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9000

CMD ["npm", "start"]
