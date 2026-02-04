#!/bin/bash
set -e

# This script allows file-based secrets to be loaded as environment variables
# Useful for Docker Swarm secrets or Kubernetes secrets

# Check for _FILE suffixed environment variables and load them
for VAR in $(env | grep '_FILE='); do
  VAR_NAME="${VAR%%_FILE=*}"
  VAR_FILE="${VAR#*=}"
  
  if [ -f "$VAR_FILE" ]; then
    export "$VAR_NAME"="$(cat "$VAR_FILE")"
    echo "Loaded $VAR_NAME from file"
  fi
done

# Execute the main command
exec "$@"
