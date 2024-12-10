#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if a version type (minor, patch) is provided
if [ -z "$1" ]; then
  echo "Usage: $0 [minor|patch]"
  exit 1
fi

# Ensure working directory is clean
if [[ $(git status --porcelain) ]]; then
  echo "Please commit or stash your changes before running this script."
  exit 1
fi

# Bump the version using npm
VERSION_TYPE=$1
echo "Bumping version ($VERSION_TYPE)..."
NEW_VERSION=$(npm version $VERSION_TYPE -m "chore(release): bump version to %s")

# Stage changes
echo "Staging changes..."
git add package.json package-lock.json

# Commit changes (npm version already commits, so this is optional if files are staged correctly)
echo "Committing changes..."
git commit -m "chore(release): bump version to $NEW_VERSION"

# Push changes and tags
echo "Pushing changes and tags..."
git push origin main --tags

echo "Version bumped to $NEW_VERSION and pushed successfully!"
