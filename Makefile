.PHONY: all reset pull stop run

PORT ?= 6000

# Default target: executes when running `make`
all: reset pull stop run

# 1. Discard any local changes (both tracked modified files and untracked files)
reset:
	@echo "Discarding local changes..."
	git reset --hard HEAD
	git clean -fd

# 2. Pull the latest code from origin
pull:
	@echo "Pulling latest changes from origin..."
	git pull origin main

# 3. Stop the currently running python server (if any)
stop:
	@echo "Stopping running python server on port $(PORT)..."
	@pkill -f "server.py" || true
	@lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || true

# 4. Start the python server in background on port 6000, redirecting output to log.txt
run:
	@echo "Starting python server on port $(PORT) (output -> log.txt)..."
	@nohup python3 server.py $(PORT) > log.txt 2>&1 &
	@echo "Server started successfully on http://localhost:$(PORT) (Logs: log.txt)"
