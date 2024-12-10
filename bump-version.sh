#!/bin/bash

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

VERSION_TYPE=$1
echo "Bumping version ($VERSION_TYPE)..."
NEW_VERSION=$(npm version $VERSION_TYPE -m "chore(release): bump version to %s")

# Stage package.json
git add package.json

# Conditionally stage package-lock.json
if [ -f package-lock.json ]; then
  git add package-lock.json
else
  echo "No package-lock.json found. Skipping..."
fi

# Push changes and tags
echo "Pushing changes and tags..."
git push origin main --tags

echo "Version bumped to $NEW_VERSION and pushed successfully!"
