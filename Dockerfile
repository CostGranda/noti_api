FROM node:8-alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn && yarn cache clean

EXPOSE 3000

CMD [ "npm", "start" ]
