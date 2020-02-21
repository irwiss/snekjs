FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install -g typescript express && npm install && tsc
CMD ["node", "index.js"]
