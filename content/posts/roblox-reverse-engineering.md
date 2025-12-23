---
title: "Extracting and Analyzing Roblox libroblox.so"
description: "Technical guide to extracting and analyzing Roblox libroblox.so with Ghidra"
date: "2025-10-09"
category: "Reverse Engineering"
legacyUrl: "/posts/2025-10-09-roblox-reverse-engineering.html"
---

<p><strong>Step-by-step technical process for extracting Roblox native library and locating purchase prompt functions using Ghidra.</strong></p>
            
<section>
<h2>1. Locate APK Files</h2>
<p>Find Roblox APK files in Sober installation:</p>
                
```
find ~/.var/app/org.vinegarhq.Sober/ -name "*.apk" -exec sh -c 'echo "=== $1 ==="; unzip -l "$1" 2>/dev/null | grep libroblox' _ {} \;
```

                
<p>Results:</p>
                
```
=== /home/user/.var/app/org.vinegarhq.Sober/data/sober/assets/base.apk ===
147180128  01-01-1981 01:01   lib/x86_64/libroblox.so

=== /home/user/.var/app/org.vinegarhq.Sober/data/sober/packages/com.roblox.client/split_config.x86_64.apk ===
140479136  01-01-1981 01:01   lib/x86_64/libroblox.so
```

</section>

<section>
<h2>2. Extract Library</h2>
                
```
unzip -j ~/.var/app/org.vinegarhq.Sober/data/sober/assets/base.apk lib/x86_64/libroblox.so -d /tmp/

# Verify extraction
ls -la /tmp/libroblox.so
# -rw-r--r-- 1 user user 147180128 libroblox.so
```

</section>

<section>
<h2>3. Ghidra Analysis</h2>
<ol>
<li>Import <code>/tmp/libroblox.so</code> into new Ghidra project</li>
<li>Run auto-analysis (default settings)</li>
<li>Wait for completion (Make some coffee, walk the dog, go fishing... it will take a while)</li>
</ol>
</section>

<section>
<h2>4. String Search Method</h2>
<p>Search for purchase-related strings in Ghidra:</p>
                
```
Window → Defined Strings
Search: "InsufficientRobux"
Search: "SetPurchasePromptIsShown" 
Search: "PurchasePromptShown"
```

</section>

<section>
<h2>5. Function Discovery</h2>
<p>Right-click on string → References → To find usage locations</p>
                
<p>Key function found at <code>02f35a00</code>:</p>
                
```
void FUN_02f35a00(long param_1, int param_2) {
if (param_2 != 0) {
FUN_02f359b0(param_1 + 0x188);  // show_purchase_prompt
return;
}
return;
}
```

</section>

<section>
<h2>6. Function Identification</h2>
<p>Rename functions based on analysis:</p>
<ul>
<li><code>FUN_02f35a00</code> → <code>set_purchase_prompt_shown_handler</code></li>
<li><code>FUN_02f359b0</code> → <code>show_purchase_prompt</code></li>
</ul>
                
<p>Call chain discovered:</p>
                
```
GUI Service → set_purchase_prompt_shown_handler → show_purchase_prompt → Queue System
```

</section>
