FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x src/scripts/start.sh

EXPOSE 3003

CMD ["./src/scripts/start.sh"]
# CMD ["npm", "run", "dev"]