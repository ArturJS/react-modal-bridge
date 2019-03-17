FROM node:8.15.1-slim
RUN apt-get update && apt-get install -y bash git openssl curl sudo
WORKDIR /react-modal-bridge
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    chown -R node:node . /react-modal-bridge
RUN npm install --global yarn
RUN npm install --global http-server
USER node
COPY --chown=node:node ./package.json .
COPY --chown=node:node ./yarn.lock .
RUN yarn --frozen-lockfile
COPY --chown=node:node ./ ./
RUN npm run build-storybook
WORKDIR /react-modal-bridge/storybook-static
EXPOSE 8080
ENTRYPOINT [ "http-server", "--port 8080" ]
