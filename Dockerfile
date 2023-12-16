FROM node:20.2.0-alpine3.16 AS build

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache \
  build-base \
  gcc \
  g++ \
  make

# Create App dir
RUN mkdir -p /app

# Set working directory to App dir
WORKDIR /app

COPY .env .

COPY ./package.json .

RUN npm cache clean --force
RUN npm install

# Copy project files
COPY . .

EXPOSE 8000

CMD [ "yarn", "start" ]
