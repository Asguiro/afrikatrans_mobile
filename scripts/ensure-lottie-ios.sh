#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/vendor/lottie-ios"
if [ -f "$DEST/lottie-ios.podspec" ]; then
  echo "lottie-ios déjà présent dans vendor/"
  exit 0
fi
mkdir -p "$ROOT/vendor"
TMP="$(mktemp -t lottie-ios.XXXXXX.tar.gz)"
curl -L "https://github.com/airbnb/lottie-ios/archive/refs/tags/4.6.0.tar.gz" -o "$TMP"
rm -rf "$DEST" "$ROOT/vendor/lottie-ios-4.6.0"
tar -xzf "$TMP" -C "$ROOT/vendor"
mv "$ROOT/vendor/lottie-ios-4.6.0" "$DEST"
rm -f "$TMP"
echo "lottie-ios installé dans vendor/lottie-ios"
