FROM node:14

WORKDIR /usr/src/app

# Installieren von SQLite
RUN apt-get update && apt-get install -y sqlite3



COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
