FROM node:10.16
WORKDIR /usr/app/src/
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn","start"]