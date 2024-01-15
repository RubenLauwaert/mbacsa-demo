#!/bin/bash

# Define the server path
SERVER_PATH="$HOME/Desktop/Thesis/Code/mbacsa-css"

# Commands to run each server instance
COMMAND_RUN_SERVER_ALICE="npm run start -- -p 3001 --seededPodConfigJson ./seedingPods/alice.json"
COMMAND_RUN_SERVER_BOB="npm run start -- -p 3002 --seededPodConfigJson ./seedingPods/bob.json"
COMMAND_RUN_SERVER_JANE="npm run start -- -p 3003 --seededPodConfigJson ./seedingPods/jane.json"

# Array to store PIDs of the server processes
declare -a SERVER_PIDS

# Function to check if a port is in use
is_port_in_use() {
    netstat -an | grep $1 > /dev/null
    return $?
}

# Function to clean up and exit
cleanup() {
    echo "Stopping server processes..."
    for pid in "${SERVER_PIDS[@]}"; do
        if kill -0 $pid > /dev/null 2>&1; then
            kill $pid
            wait $pid
        fi
    done
    echo "Server processes stopped."
    exit 0
}

# Set trap to call cleanup function on script interruption
trap cleanup INT TERM

# Check each port
PORTS=(3001 3002 3003)
for port in "${PORTS[@]}"; do
    if is_port_in_use $port; then
        echo "Port $port is already in use"
        exit 1
    fi
done

# Remove the .internal directory
INTERNAL_DIR="$SERVER_PATH/.internal"
if [ -d "$INTERNAL_DIR" ]; then
    echo "Removing $INTERNAL_DIR"
    rm -rf "$INTERNAL_DIR"
fi

# Start the server instances
echo "Starting server Alice"
cd "$SERVER_PATH" && eval $COMMAND_RUN_SERVER_ALICE &
SERVER_PIDS+=($!)

echo "Starting server Bob"
cd "$SERVER_PATH" && eval $COMMAND_RUN_SERVER_BOB &
SERVER_PIDS+=($!)

echo "Starting server Jane"
cd "$SERVER_PATH" && eval $COMMAND_RUN_SERVER_JANE &
SERVER_PIDS+=($!)

# Wait for all servers to exit
wait
