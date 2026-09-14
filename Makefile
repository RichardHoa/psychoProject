# Configuration variables
PORT ?= 3000
HOST ?= 0.0.0.0
APP_DIR ?= psychoProject
LOG_FILE ?= log.txt
PID_FILE ?= .server.pid

.PHONY: all prod build start down stop status logs clean help

all: prod

help:
	@echo "Available commands:"
	@echo "  make prod    - Build application and start standalone production Node server on port $(PORT)"
	@echo "  make down    - Stop the running production server"
	@echo "  make build   - Build the production bundle into $(APP_DIR)/build"
	@echo "  make status  - Check status of the production server"
	@echo "  make logs    - Tail production server logs"
	@echo "  make clean   - Clean logs and temporary PID files"

build:
	@echo "==> Compiling production build..."
	npm --prefix $(APP_DIR) run build

prod: down build
	@echo "==> Starting production server on port $(PORT) with nohup in background..."
	@PORT=$(PORT) HOST=$(HOST) nohup node $(APP_DIR)/build/index.js > $(LOG_FILE) 2>&1 & echo $$! > $(PID_FILE)
	@sleep 2
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE) 2>/dev/null) 2>/dev/null; then \
		echo "==> Production server started successfully!"; \
		echo "    - Port: $(PORT)"; \
		echo "    - Host: $(HOST)"; \
		echo "    - Log file: $(LOG_FILE)"; \
		echo "    - PID file: $(PID_FILE) (PID: $$(cat $(PID_FILE)))"; \
	elif lsof -ti :$(PORT) >/dev/null 2>&1; then \
		echo "==> Production server started successfully on port $(PORT)!"; \
		echo "    - Log file: $(LOG_FILE)"; \
	else \
		echo "==> Warning: Production server might not have started. Check $(LOG_FILE):"; \
		tail -n 20 $(LOG_FILE) 2>/dev/null || true; \
	fi

down:
	@echo "==> Stopping server..."
	@if [ -f $(PID_FILE) ]; then \
		PID=$$(cat $(PID_FILE) 2>/dev/null); \
		if [ -n "$$PID" ]; then \
			kill $$PID 2>/dev/null || true; \
			kill -9 $$PID 2>/dev/null || true; \
			echo "    - Terminated PID $$PID from $(PID_FILE)"; \
		fi; \
		rm -f $(PID_FILE); \
	fi
	@PIDS=$$(lsof -ti :$(PORT) 2>/dev/null || true); \
	if [ -n "$$PIDS" ]; then \
		for pid in $$PIDS; do \
			kill -9 $$pid 2>/dev/null || true; \
			echo "    - Terminated process on port $(PORT) (PID: $$pid)"; \
		done; \
	fi
	@echo "==> Server stopped."

stop: down

status:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE) 2>/dev/null) 2>/dev/null; then \
		echo "==> Production server is RUNNING (PID: $$(cat $(PID_FILE)), Port: $(PORT))"; \
	elif lsof -ti :$(PORT) >/dev/null 2>&1; then \
		echo "==> Production server is RUNNING on port $(PORT) (PID(s): $$(lsof -ti :$(PORT) 2>/dev/null | tr '\n' ' '))"; \
	else \
		echo "==> Server is NOT running on port $(PORT)"; \
	fi

logs:
	@if [ -f $(LOG_FILE) ]; then \
		tail -f $(LOG_FILE); \
	else \
		echo "Log file $(LOG_FILE) does not exist yet."; \
	fi

clean:
	@rm -f $(LOG_FILE) $(PID_FILE)
	@echo "==> Cleaned log and PID files."
