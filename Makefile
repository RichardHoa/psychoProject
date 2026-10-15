# Production runs as a systemd service on Ubuntu:
#   - systemd restarts the Node server whenever it exits (crash, OOM kill) and starts it at boot;
#   - a health-check timer curls it every minute and restarts it after 3 failures in a row, which
#     catches a server that is still running but no longer answering.
# One-time setup on the server: `make install-service`. After that, `make prod` deploys.

# Configuration variables
PORT ?= 3000
HOST ?= 0.0.0.0
# Public URL visitors use. SvelteKit rejects form POSTs (e.g. the safety gate) whose Origin
# doesn't match it, and adapter-node assumes https when it is unset.
# Defaults to the production origin; override for local/other deploys: make prod ORIGIN=http://localhost:3000
ORIGIN ?= https://psychology.richardhoa.io.vn

SERVICE ?= meo
APP_DIR := $(abspath .)
# Run make as your normal user, not with sudo: the recipes call sudo themselves.
RUN_USER ?= $(shell id -un)
NODE_BIN ?= $(shell command -v node)
CURL_BIN ?= $(shell command -v curl)
UNIT_DIR := /etc/systemd/system
STATE_DIR := /var/lib/$(SERVICE)-health
# Installed root-owned (the check runs as root to restart the service), not run from the repo.
HEALTH_SCRIPT := /usr/local/lib/$(SERVICE)/health-check.sh
# Consecutive failed health checks before the server is restarted.
HEALTH_FAILURES ?= 3

.PHONY: all prod build start restart down stop status logs health install-service uninstall-service help

all: prod

help:
	@echo "Available commands:"
	@echo "  make install-service   - One-time: install and enable the systemd service ($(SERVICE)) and its"
	@echo "                           health check (run as your user, not with sudo; it asks for sudo itself)"
	@echo "  make prod              - Build, then (re)start the service on port $(PORT)"
	@echo "                           (ORIGIN=$(ORIGIN); override with ORIGIN=... then re-run install-service)"
	@echo "  make build             - Build the production bundle into $(APP_DIR)/build"
	@echo "  make restart           - Restart the service without rebuilding"
	@echo "  make down              - Stop the service and its health check (both start again at boot)"
	@echo "  make status            - Show the service and health-check status"
	@echo "  make logs              - Follow the server logs"
	@echo "  make health            - Run the health check once, now"
	@echo "  make uninstall-service - Stop and remove the service and health check"

build:
	@echo "==> Compiling production build..."
	npm --prefix $(APP_DIR) run build

prod: build restart

start restart:
	@systemctl cat $(SERVICE).service >/dev/null 2>&1 || \
		{ echo "==> $(SERVICE).service is not installed. Run: make install-service"; exit 1; }
	sudo systemctl restart $(SERVICE).service
	sudo systemctl start $(SERVICE)-health.timer
	@sleep 2
	@systemctl --no-pager --lines=0 status $(SERVICE).service || true
	@$(MAKE) --no-print-directory health

# The health check is stopped too, or it would restart the server a few minutes later.
down stop:
	sudo systemctl stop $(SERVICE)-health.timer $(SERVICE).service
	@echo "==> Stopped. It will start again at boot; use 'make uninstall-service' to remove it."

status:
	@systemctl --no-pager status $(SERVICE).service $(SERVICE)-health.timer || true

logs:
	journalctl -u $(SERVICE).service -u $(SERVICE)-health.service -f

health:
	@if $(CURL_BIN) -fsS -o /dev/null --max-time 10 http://127.0.0.1:$(PORT)/; then \
		echo "==> Healthy: http://127.0.0.1:$(PORT)/ answered"; \
	else \
		echo "==> NOT healthy: http://127.0.0.1:$(PORT)/ did not answer"; exit 1; \
	fi

# The service runs as $(RUN_USER) (not root) with the absolute node path captured now, so nvm or
# other per-user Node installs work under systemd too.
install-service:
	@test "$$(id -u)" != 0 || { echo "Run 'make install-service' as your normal user, without sudo."; exit 1; }
	@test -n "$(NODE_BIN)" || { echo "node not found on PATH"; exit 1; }
	@test -n "$(CURL_BIN)" || { echo "curl not found; install it: sudo apt install curl"; exit 1; }
	@test -f $(APP_DIR)/build/index.js || $(MAKE) --no-print-directory build
	@echo "==> Installing $(SERVICE).service (user $(RUN_USER), node $(NODE_BIN), port $(PORT))"
	@printf '%s\n' \
		'[Unit]' \
		'Description=MÈO website (SvelteKit, adapter-node)' \
		'After=network-online.target' \
		'Wants=network-online.target' \
		'StartLimitIntervalSec=0' \
		'' \
		'[Service]' \
		'Type=simple' \
		'User=$(RUN_USER)' \
		'WorkingDirectory=$(APP_DIR)' \
		'Environment=NODE_ENV=production' \
		'Environment=PORT=$(PORT)' \
		'Environment=HOST=$(HOST)' \
		'Environment=ORIGIN=$(ORIGIN)' \
		'ExecStart=$(NODE_BIN) $(APP_DIR)/build/index.js' \
		'Restart=always' \
		'RestartSec=3' \
		'' \
		'[Install]' \
		'WantedBy=multi-user.target' \
		| sudo tee $(UNIT_DIR)/$(SERVICE).service >/dev/null
	@echo "==> Installing $(SERVICE)-health.timer (every minute, restart after $(HEALTH_FAILURES) failures)"
	sudo install -D -m 755 -o root -g root $(APP_DIR)/deploy/health-check.sh $(HEALTH_SCRIPT)
	@printf '%s\n' \
		'[Unit]' \
		'Description=Health check for $(SERVICE).service' \
		'' \
		'[Service]' \
		'Type=oneshot' \
		'StateDirectory=$(SERVICE)-health' \
		'ExecStart=$(HEALTH_SCRIPT) $(SERVICE) http://127.0.0.1:$(PORT)/ $(HEALTH_FAILURES) $(STATE_DIR)' \
		| sudo tee $(UNIT_DIR)/$(SERVICE)-health.service >/dev/null
	@printf '%s\n' \
		'[Unit]' \
		'Description=Run the $(SERVICE) health check every minute' \
		'' \
		'[Timer]' \
		'OnBootSec=2min' \
		'OnUnitActiveSec=1min' \
		'AccuracySec=10s' \
		'' \
		'[Install]' \
		'WantedBy=timers.target' \
		| sudo tee $(UNIT_DIR)/$(SERVICE)-health.timer >/dev/null
	sudo systemctl daemon-reload
	sudo systemctl enable --now $(SERVICE).service $(SERVICE)-health.timer
	@sleep 2
	@$(MAKE) --no-print-directory status

uninstall-service:
	-sudo systemctl disable --now $(SERVICE)-health.timer $(SERVICE).service
	sudo rm -f $(UNIT_DIR)/$(SERVICE).service $(UNIT_DIR)/$(SERVICE)-health.service $(UNIT_DIR)/$(SERVICE)-health.timer
	sudo rm -rf $(STATE_DIR) $(dir $(HEALTH_SCRIPT))
	sudo systemctl daemon-reload
	@echo "==> Removed $(SERVICE) service and health check."
