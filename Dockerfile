FROM node:16.17.0
USER node
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .
ARG NODE_ENV
RUN npm install
COPY --chown=node:node . .
ENV PORT 8000
EXPOSE $PORT