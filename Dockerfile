FROM strapi/base

WORKDIR /

ARG ENV=production
ARG PORT=1337

COPY . .

RUN npm install
RUN npm run patch

ENV NODE_ENV ${ENV}

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "start"]
