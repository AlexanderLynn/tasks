#!/bin/bash
set -euo pipefail

# Get options from Home Assistant
API_KEY=$(jq -r '.api_key' /data/options.json)
TIMEZONE=$(jq -r '.timezone' /data/options.json)
ENABLE_MCP=$(jq -r '.enable_mcp_server // true' /data/options.json)
MCP_PORT_OPTION=$(jq -r '.mcp_port // 3000' /data/options.json)
LOG_LEVEL=$(jq -r '.log_level // "info"' /data/options.json)

API_PORT=8080
FRONTEND_PORT=8237
MCP_PORT=3000

# Set environment variables
export NODE_ENV=production
export DATABASE_PATH=/data/tasks.db
export API_PORT
export API_HOST=0.0.0.0
export MCP_PORT
export DEFAULT_API_KEY="$API_KEY"
export DEFAULT_TIMEZONE="$TIMEZONE"
export LOG_LEVEL="$LOG_LEVEL"
export ENABLE_MCP_SERVER="$ENABLE_MCP"

log_frontend_artifacts() {
    echo "Frontend directory: /usr/share/nginx/html"
    if [ -d /usr/share/nginx/html ]; then
        ls -lah /usr/share/nginx/html
        echo "Frontend files:"
        find /usr/share/nginx/html -maxdepth 2 -type f | sort
    fi

    if [ -f /usr/share/nginx/html/index.html ]; then
        echo "index.html bytes: $(wc -c < /usr/share/nginx/html/index.html)"
        echo "index.html head:"
        sed -n '1,12p' /usr/share/nginx/html/index.html
    else
        echo "ERROR: /usr/share/nginx/html/index.html is missing"
    fi
}

# Initialize database if needed
if [ ! -f /data/tasks.db ]; then
    echo "Initializing database..."
    npm run migrate || true
fi

echo "Using nginx config at /etc/nginx/nginx.conf"
sed -n '1,220p' /etc/nginx/nginx.conf
log_frontend_artifacts

echo "Validating nginx config..."
nginx -t

# Start nginx in background
echo "Starting nginx on port ${FRONTEND_PORT}..."
nginx

# Start the API server
echo "Starting Tasks Todo App API Server..."
echo "API Key: ${API_KEY:0:10}..."
echo "Timezone: $TIMEZONE"
echo "Frontend Port: $FRONTEND_PORT"
echo "API Port: $API_PORT"
echo "MCP Port: $MCP_PORT"
echo "MCP Server Enabled: $ENABLE_MCP"
echo "Log Level: $LOG_LEVEL"
echo "Frontend URL: http://127.0.0.1:${FRONTEND_PORT}/"
echo "To change exposed host ports in Home Assistant, use the add-on Network settings for container ports 8237, 8080, and 3000."
if [ "$MCP_PORT_OPTION" != "$MCP_PORT" ]; then
    echo "Configured mcp_port option (${MCP_PORT_OPTION}) is ignored by the add-on runtime; use the Home Assistant Network settings to change the exposed host port for container port 3000."
fi

echo "Checking frontend and API endpoints..."
curl -I "http://127.0.0.1:${FRONTEND_PORT}/" || true
curl -fsS "http://127.0.0.1:${FRONTEND_PORT}/healthz" || true

shutdown() {
    if [ -n "${APP_PID:-}" ] && kill -0 "$APP_PID" 2>/dev/null; then
        kill "$APP_PID" 2>/dev/null || true
        wait "$APP_PID" 2>/dev/null || true
    fi
}

trap shutdown EXIT INT TERM

echo "Starting Node application..."
npm start &
APP_PID=$!

for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${API_PORT}/health" >/dev/null 2>&1; then
        echo "API health check succeeded: http://127.0.0.1:${API_PORT}/health"
        break
    fi
    sleep 1
done

curl -fsS "http://127.0.0.1:${API_PORT}/health" || true

wait "$APP_PID"
