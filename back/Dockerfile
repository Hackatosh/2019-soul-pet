FROM node:10.16
WORKDIR /usr/app/src/
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 8000
CMD ["yarn","dev"]