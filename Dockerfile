FROM node:12

WORKDIR /app

ENV PORT=80
ENV express_jwtPrivateKey=""

ENV mySql_host=""
ENV mySql_port=3306
ENV mySql_connectionLimit=10
ENV mySql_database=""
ENV mySql_user=""
ENV mySql_password=""

COPY package.json ./

RUN npm install

COPY . .

CMD node server.js
