---
title: "macOS Code Signing for Patched Binaries"
description: "How to handle macOS code signing when patching binaries - from removal to ad-hoc re-signing"
date: "2025-10-09"
category: "Reverse Engineering"
legacyUrl: "/posts/2025-10-09-macos-code-signing-patched-binaries.html"
---

<section>
<h2>The Problem</h2>
<p>When patching a macOS application binary (like modifying RobloxPlayer to disable purchase prompts), you'll quickly discover that modern macOS won't let you run modified binaries that still have their original code signature. The OS detects the mismatch and refuses to execute the binary.</p>

<p>But simply removing the signature isn't enough on macOS 15 and later - the system still refuses to launch unsigned binaries with cryptic errors.</p>
</section>

<section>
<h2>The Journey</h2>

<h3>Step 1: Removing the Original Signature</h3>
<p>First, verify the binary is signed:</p>
                
```
codesign -d -vv "/Applications/Roblox.app/Contents/MacOS/RobloxPlayer"
```


<p>You'll see output showing the developer's signature, authority chain, and team identifier. To remove it:</p>
                
```
codesign --remove-signature "/Applications/Roblox.app/Contents/MacOS/RobloxPlayer"
```


<p>Verify it's gone:</p>
                
```
codesign -d "/Applications/Roblox.app/Contents/MacOS/RobloxPlayer"
# Output: code object is not signed at all
```


<h3>Step 2: The Launch Failure</h3>
<p>Attempting to launch the unsigned binary results in:</p>
                
```
Error Domain=RBSRequestErrorDomain Code=5 "Launch failed."
Error Domain=NSPOSIXErrorDomain Code=153 "Unknown error: 153"
Launchd job spawn failed
```


<p>Error 153 indicates that macOS Gatekeeper or launchd is blocking the execution of the unsigned binary. Modern macOS versions are increasingly strict about running unsigned code.</p>

<h3>Step 3: Ad-Hoc Re-Signing</h3>
<p>The solution is to re-sign the binary with an ad-hoc signature. This tells macOS "yes, this binary is intentionally modified and I trust it":</p>
                
```
codesign -s - -f --deep "/Applications/Roblox.app"
```


<p>Breaking down the flags:</p>
<dl>
<dt><code>-s -</code></dt>
<dd>Sign with an ad-hoc signature (the dash means "no identity")</dd>

<dt><code>-f</code></dt>
<dd>Force - replace any existing signature</dd>

<dt><code>--deep</code></dt>
<dd>Sign nested code (frameworks, plugins, etc. within the app bundle)</dd>
</dl>
</section>

<section>
<h2>Why This Works</h2>
<p>An ad-hoc signature doesn't provide cryptographic verification of the code's origin (like a Developer ID does), but it does:</p>
<ul>
<li>Satisfy launchd's requirement that binaries have some form of signature</li>
<li>Create a code directory hash that the OS can verify hasn't been tampered with after signing</li>
<li>Allow the binary to pass basic security checks without needing a developer certificate</li>
</ul>

<p>The ad-hoc signature essentially says "I, the local user, vouch for this binary" rather than "Apple and this developer vouch for this binary".</p>
</section>

<section>
<h2>Verification</h2>
<p>After ad-hoc signing, verify the new signature:</p>
                
```
codesign -d -vv "/Applications/Roblox.app/Contents/MacOS/RobloxPlayer"
```


<p>You'll see it now has a signature, but with no authority chain - just "Signature=adhoc".</p>
</section>

<section>
<h2>Important Considerations</h2>

<h3>System Integrity Protection (SIP)</h3>
<p>This technique works for applications in user-writable locations like <code>/Applications</code>. System binaries protected by SIP cannot be modified even with root privileges.</p>

<h3>Gatekeeper</h3>
<p>First launch may still trigger a Gatekeeper warning. You can bypass this via:</p>
<ul>
<li>Right-click → Open</li>
<li>System Settings → Privacy & Security → "Open Anyway"</li>
<li>Command line: <code>xattr -cr /Applications/Roblox.app</code> to remove quarantine attributes</li>
</ul>

<h3>Updates</h3>
<p>Any update to the application will replace your patched binary with the official version. You'll need to reapply patches and re-sign after each update.</p>

<h3>Online Verification</h3>
<p>Some applications perform additional integrity checks (comparing hashes with a server, verifying specific code sections, etc.). Ad-hoc signing won't help with those - you'd need to patch the verification routines as well.</p>
</section>

<section>
<h2>Complete Workflow</h2>
<p>The full process for patching and running a macOS binary:</p>
<ol>
<li>Make a backup: <code>cp -R /Applications/App.app /Applications/App.app.backup</code></li>
<li>Patch the binary (with Ghidra, hex editor, etc.)</li>
<li>Remove original signature: <code>codesign --remove-signature /Applications/App.app/Contents/MacOS/Binary</code></li>
<li>Ad-hoc re-sign: <code>codesign -s - -f --deep /Applications/App.app</code></li>
<li>Launch and test</li>
</ol>
</section>
