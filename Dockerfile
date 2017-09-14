FROM node:boron

WORKDIR /var/build
COPY . /var/build
CMD npm install && npm run test-bamboo