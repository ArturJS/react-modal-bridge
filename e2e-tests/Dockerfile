FROM node:8.15.1-slim
RUN apt-get update && apt-get install -y bash git openssl curl sudo
RUN apt-get -y install procps
WORKDIR /e2e-tests
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    chown -R node:node . /e2e-tests
USER node
COPY --chown=node:node ./package.json .
COPY --chown=node:node ./package-lock.json .
RUN npm i
COPY --chown=node:node ./ ./
