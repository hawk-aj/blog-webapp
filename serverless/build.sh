#!/usr/bin/env bash
# build.sh — Build the Lambda deployment zip.
# Cross-compiles for Linux x86_64 so native packages (bcrypt) work on Lambda.
# Run from Git Bash or WSL on Windows.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LAMBDA_DIR="$SCRIPT_DIR/lambda"
BUILD_DIR="$SCRIPT_DIR/build"
ZIP_PATH="$SCRIPT_DIR/portfolio-lambda.zip"

echo "=== Building Lambda package ==="

echo "→ Cleaning build dir..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo "→ Installing dependencies for manylinux (Python 3.12)..."
pip install \
  --platform manylinux2014_x86_64 \
  --python-version 3.12 \
  --only-binary=:all: \
  --target "$BUILD_DIR" \
  --quiet \
  -r "$LAMBDA_DIR/requirements.txt"

echo "→ Copying source files..."
cp "$LAMBDA_DIR"/*.py "$BUILD_DIR/"

echo "→ Zipping..."
rm -f "$ZIP_PATH"
python -c "
import zipfile, os, sys
build = sys.argv[1]
out   = sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(build):
        for f in files:
            full = os.path.join(root, f)
            z.write(full, os.path.relpath(full, build))
print('Done')
" "$BUILD_DIR" "$ZIP_PATH"

SIZE=$(du -sh "$ZIP_PATH" | cut -f1)
echo ""
echo "Built: $ZIP_PATH ($SIZE)"
echo ""
echo "Next — upload to Lambda:"
echo "  aws lambda update-function-code \\"
echo "    --function-name portfolio-api \\"
echo "    --zip-file fileb://$ZIP_PATH"
