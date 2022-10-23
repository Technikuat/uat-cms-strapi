FROM strapi/base

WORKDIR /

ARG ENV=production
ARG PORT=1337

COPY ./patches ./
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

ENV NODE_ENV ${ENV}

RUN yarn build

EXPOSE ${PORT}

CMD ["yarn", "start"]
