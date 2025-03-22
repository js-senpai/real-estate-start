FROM node:22-alpine

WORKDIR /app
USER root
RUN apk add --no-cache openssl tzdata

COPY . .

RUN yarn install --frozen-lockfile  --production=false \
    && npx prisma generate \
    && yarn run build

RUN rm -rf ./src ./node_modules

RUN yarn install --frozen-lockfile  --production=true


ENTRYPOINT [ "yarn", "run", "start:prod" ]