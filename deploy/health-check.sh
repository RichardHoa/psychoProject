#!/bin/sh
# Run every minute by <service>-health.timer (see the Makefile). Restarts the service after
# FAILURES consecutive failed checks, which catches a server that is running but not answering.
# Usage: health-check.sh <service> <url> <failures> <state-dir>
set -u
service=$1
url=$2
failures=$3
count_file=$4/failures

if curl -fsS -o /dev/null --max-time 10 "$url"; then
	echo 0 > "$count_file"
	exit 0
fi

count=$(( $(cat "$count_file" 2>/dev/null || echo 0) + 1 ))
echo "$count" > "$count_file"
echo "health check failed ($count/$failures): $url"

if [ "$count" -ge "$failures" ]; then
	echo 0 > "$count_file"
	echo "restarting $service.service"
	systemctl restart "$service.service"
fi
