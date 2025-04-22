#!/bin/bash

# Helper script for building and development from root directory

function show_help {
  echo "Usage: ./build.sh [command]"
  echo ""
  echo "Commands:"
  echo "  install    - Install dependencies for the app"
  echo "  dev        - Start development server"
  echo "  build      - Build the Next.js application"
  echo "  start      - Start the production server"
  echo "  lint       - Run the linter"
  echo "  test       - Run tests"
  echo "  webpack    - Build using webpack"
  echo ""
}

if [ $# -eq 0 ]; then
  show_help
  exit 1
fi

case "$1" in
  install)
    (cd app && npm install)
    ;;
  dev)
    (cd app && npm run dev)
    ;;
  build)
    (cd app && npm run build)
    ;;
  start)
    (cd app && npm run start)
    ;;
  lint)
    (cd app && npm run lint)
    ;;
  test)
    (cd app && npm run test)
    ;;
  webpack)
    (cd app && npm run webpack:build)
    ;;
  *)
    show_help
    exit 1
    ;;
esac 