FROM node:16-alpine 
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm cache verify
RUN npm install --force
RUN npm install @angular/cli@latest -g
COPY . /usr/src/app
EXPOSE 4200 49153
CMD npm run start
