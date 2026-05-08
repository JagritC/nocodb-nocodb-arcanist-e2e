FROM node:22.12.0-bookworm

WORKDIR /app

ENV CI=true \
    NC_DISABLE_TELE=true \
    PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git make g++ python3 \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10 \
  && npm install --prefix /opt/arcanist-runtime exceljs@4.4.0

COPY . .

RUN sed -i '/^use-node-version/d' .npmrc \
  && pnpm bootstrap
