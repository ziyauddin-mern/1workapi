FROM node:latest

WORKDIR /app/1work-back-end

COPY package*.json ./

RUN npm install -g pm2

RUN npm install

COPY . .

RUN npm run build


EXPOSE 8080

CMD ["npm", "start"]

