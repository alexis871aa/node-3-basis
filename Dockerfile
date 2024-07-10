FROM node:18

WORKDIR /usr/scr/app

COPY . .

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]

