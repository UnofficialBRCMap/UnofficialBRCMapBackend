FROM node:16.15

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app && npm i -g pnpm
USER node
WORKDIR /usr/src/app

COPY --chown=node:node prisma ./prisma/
# RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node  package.json pnpm-lock.yaml ./
RUN pnpm install

COPY --chown=node:node . .

RUN pnpm build

EXPOSE 8080

CMD [ "npx", "nest", "start" ]

# https://www.tomray.dev/nestjs-docker-production