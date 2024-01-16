#!/bin/bash

# Define the server path
SERVER_PATH="$HOME/Desktop/Thesis/Code/mbacsa-css"

# Function to run a command in a new Terminal window with cleanup
run_in_new_terminal() {
    osascript <<END
    tell application "Terminal"
        do script "cd $SERVER_PATH && $1; echo 'Press enter to close...'; read"
        activate
    end tell
END
}

# Commands to run each server instance
COMMAND_RUN_SERVER_ALICE="npm run start -- -p 3001 --seededPodConfigJson ./seedingPods/alice.json"
COMMAND_RUN_SERVER_BOB="npm run start -- -p 3002 --seededPodConfigJson ./seedingPods/bob.json"
COMMAND_RUN_SERVER_JANE="npm run start -- -p 3003 --seededPodConfigJson ./seedingPods/jane.json"

# Function to check if a port is in use
is_port_in_use() {
    lsof -i tcp:$1 > /dev/null
    return $?
}

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

# Start the server instances in separate Terminal windows
run_in_new_terminal "$COMMAND_RUN_SERVER_ALICE"
run_in_new_terminal "$COMMAND_RUN_SERVER_BOB"
run_in_new_terminal "$COMMAND_RUN_SERVER_JANE"

# The script ends here, as we cannot wait for processes in separate terminals
echo "Servers started in separate Terminal windows. Please close each window manually to stop the servers."

