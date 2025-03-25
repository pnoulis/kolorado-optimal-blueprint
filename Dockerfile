FROM node:22.14.0-bookworm-slim
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get -y install --no-install-recommends make \
    && apt-get -y install --no-install-recommends m4 \
    && apt-get -y install --no-install-recommends git \
    && apt-get -y install --no-install-recommends sqlite3
USER node
WORKDIR /srv
COPY --chown=node:node . .
ENTRYPOINT [ "/bin/bash", "-c"]
