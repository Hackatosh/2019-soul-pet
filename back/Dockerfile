FROM node:12.2.0-alpine
WORKDIR /usr/app/
ENV PATH /usr/app/node_modules/.bin:$PATH
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 8000
CMD ["yarn","dev"]