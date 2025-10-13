#!/bin/bash

# Image optimization script for blog
# Reads from images/originals/ and generates multiple sizes and WebP versions in images/

set -e

SOURCE_DIR="images/originals"
OUTPUT_DIR="images"
SIZES=(400 800 1200)

echo "Starting image optimization..."
echo "Reading from: $SOURCE_DIR/"
echo "Writing to: $OUTPUT_DIR/"
echo ""

cd "$(dirname "$0")"

# Verify source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: $SOURCE_DIR directory not found!"
    exit 1
fi

# Process each JPEG/JPG file in originals
shopt -s nullglob
for img in "$SOURCE_DIR"/*.jpg "$SOURCE_DIR"/*.jpeg "$SOURCE_DIR"/*.JPG "$SOURCE_DIR"/*.JPEG; do

    # Get filename without extension
    filename=$(basename "$img")
    name="${filename%.*}"
    ext="${filename##*.}"

    echo ""
    echo "Processing: $filename"

    # Generate each size
    for size in "${SIZES[@]}"; do
        output_jpg="$OUTPUT_DIR/${name}-${size}w.jpg"
        output_webp="$OUTPUT_DIR/${name}-${size}w.webp"

        # Generate JPEG version
        if [ ! -f "$output_jpg" ]; then
            echo "  Creating ${size}w JPEG..."
            magick "$img" -resize "${size}>" -quality 85 -strip "$output_jpg"
        else
            echo "  Skipping ${size}w JPEG (already exists)"
        fi

        # Generate WebP version
        if [ ! -f "$output_webp" ]; then
            echo "  Creating ${size}w WebP..."
            magick "$img" -resize "${size}>" -quality 85 -strip "$output_webp"
        else
            echo "  Skipping ${size}w WebP (already exists)"
        fi
    done

    # Also create WebP version of original size
    original_webp="$OUTPUT_DIR/${name}.webp"
    if [ ! -f "$original_webp" ]; then
        echo "  Creating original size WebP..."
        magick "$img" -quality 85 -strip "$original_webp"
    else
        echo "  Skipping original WebP (already exists)"
    fi
done

echo ""
echo "Optimization complete!"
echo ""
echo "Summary:"
find "$OUTPUT_DIR" -name "*-[0-9]*w.*" -not -path "*/originals/*" | wc -l | xargs echo "  Generated images:"
du -sh "$OUTPUT_DIR" | awk '{print "  Total directory size: " $1}'
du -sh "$SOURCE_DIR" | awk '{print "  Originals size: " $1}'
