FROM node:12.2.0-alpine
WORKDIR /usr/app/
ENV PATH /usr/app/node_modules/.bin:$PATH
RUN rm package.json || true
RUN rm yarn.lock || true
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 8000
CMD ["yarn","dev"]