FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:20-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
