FROM --platform=linux/amd64 node:lts-jod
RUN apt update && apt upgrade -y
RUN apt install make
WORKDIR /srv
ENV NODE_ENV development
USER node
ENTRYPOINT [ "/bin/bash", "-c"]
CMD [ "cd $PACKAGE; make dev" ]
