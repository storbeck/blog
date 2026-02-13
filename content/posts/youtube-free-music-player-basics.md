---
title: "Listen to YouTube Music for Free (No App, No Premium)"
description: "The fastest setup: use yt-dlp + mpv from your terminal, with a tiny Bash helper script."
date: "2026-02-13"
category: "How To"
---

This is a basic way to play music from YouTube from your terminal.

## Option 1 (easiest): Terminal only

Install tools once:

```bash
brew install yt-dlp mpv
```

Play a track by search term:

```bash
mpv --no-video --volume=100 "$(yt-dlp -f 'bestaudio' --get-url --no-playlist 'ytsearch1:Nujabes Aruarian Dance' | head -n 1)"
```

What this does:

1. `yt-dlp` searches YouTube and resolves the best audio stream URL
2. `mpv` plays that URL as audio only

To play something else, change the text inside `ytsearch1:...`.

## Make it reusable with a tiny script

Create `ytmusic`:

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "Usage: ytmusic <search terms>"
  exit 1
fi

query="$*"
url="$(yt-dlp -f 'bestaudio' --get-url --no-playlist "ytsearch1:${query}" | head -n 1)"

if [ -z "$url" ]; then
  echo "No result found for: $query"
  exit 1
fi

mpv --no-video --volume=100 "$url"
```

Make it executable:

```bash
chmod +x ytmusic
```

Run it:

```bash
./ytmusic nujabes aruarian dance
./ytmusic aphex twin xtal
```

## Does this always avoid ads?

You do not need YouTube Premium for this method.

Ad behavior can still vary by video, region, account state, and YouTube policy changes. In practice, these flows are often lighter than the normal YouTube watch page, but nothing here guarantees zero ads forever.

## Quick troubleshooting

If `mpv` opens but you hear nothing, make sure your command includes `-f 'bestaudio'`:

```bash
mpv --no-video --volume=100 "$(yt-dlp -f 'bestaudio' --get-url --no-playlist 'ytsearch1:YOUR SEARCH HERE' | head -n 1)"
```

The key part is `-f 'bestaudio'`.
