FROM node:11-slim

COPY . /usr/node/app

# Chromium launch path for puppeeter
ENV CHROME_BIN /usr/bin/chromium-browser

# Puppeteer v1.9.0 works with Chromium 71.
RUN yarn add puppeteer@1.11.0

