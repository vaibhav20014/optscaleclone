# -------- Setup --------
ARG IMAGE=node:18.14.2-alpine3.16

FROM $IMAGE as builder

WORKDIR /usr/src/app

ENV NODE_ENV production

# -------- UI --------
WORKDIR /usr/src/app/ui
COPY jira_ui/ui/package*.json ./
RUN npm ci --ignore-scripts --legacy-peer-deps
COPY jira_ui/ui/ ./
RUN mv eslint.config.mjs eslint.config.mjs
RUN npm run build && rm -rf node_modules

# -------- Server --------
WORKDIR /usr/src/app/server
COPY jira_ui/server/package*.json ./
RUN npm ci --ignore-scripts
COPY jira_ui/server/ ./
RUN ./scripts/prune_node_modules.sh

# -------- Final stage --------
FROM $IMAGE

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ui/ ./ui
COPY --from=builder /usr/src/app/server ./server

EXPOSE 4000

WORKDIR /usr/src/app/server

CMD ["npm", "start"]
