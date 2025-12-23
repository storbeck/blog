---
title: "Opening Chrome DevTools Console in Slack"
description: "How to open Chrome DevTools console inside Slack to monitor network requests, inspect source code, set breakpoints, and execute commands"
date: "2025-10-09"
category: "Development, Debugging"
legacyUrl: "/posts/2025-10-09-slack-dev-tools.html"
---

<p>Slack is built on Electron, which means you can open Chrome DevTools inside it. Useful for monitoring API requests, debugging integrations, or setting breakpoints in the minified source.</p>

<section>
<h2>The Process</h2>
<p>Launch Slack from terminal with the developer menu enabled:</p>
                
```
SLACK_DEVELOPER_MENU=true /Applications/Slack.app/Contents/MacOS/Slack
```


<p>This adds a new menu option: <strong>View → Developer → Enable Main Process Inspector</strong></p>

<p>Click that to start the debugger on port 9229.</p>
</section>

<section>
<h2>Connecting DevTools</h2>
<p>Open Chrome and go to <code>chrome://inspect/#devices</code>. You'll see an Electron target:</p>
                
```
localhost:9229 (v22.19.0)
trace
electron/js2c/browser_init
file:///
```


<p>Click <strong>inspect</strong> to open DevTools for the main process.</p>

<p>Now paste this into the console to open DevTools inside Slack itself:</p>
                
```
const { BrowserWindow } = require('electron')
BrowserWindow.getAllWindows()[0].webContents.toggleDevTools()
```


<p>DevTools opens inside Slack with full access to Network tab, Console, and Sources.</p>
</section>

<section>
<h2>Multiple Workspaces</h2>
<p>If you have multiple workspaces open, this opens DevTools on all of them:</p>
                
```
const { BrowserWindow } = require('electron')
BrowserWindow.getAllWindows().forEach(w => w.webContents.toggleDevTools())
```

</section>

<section>
<h2>Debugging Other Node Apps</h2>
<p>Most Node.js apps can open a debug port for inspection. For example, to debug Claude Code:</p>
                
```
kill -USR1 $(pgrep -f claude)
```

<p>Then connect via <code>chrome://inspect/#devices</code> to view cli.js, set breakpoints, and inspect the running process.</p>
</section>
