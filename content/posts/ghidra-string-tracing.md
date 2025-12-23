---
title: "Tracing Roblox Purchase Prompt Functions"
description: "Tracing Roblox purchase prompt functions through string references in libroblox.so using Ghidra static analysis"
date: "2025-10-09"
category: "Reverse Engineering"
legacyUrl: "/posts/2025-10-09-ghidra-string-tracing.html"
---

<p>Roblox games have proximity-triggered purchase prompts that can interrupt gameplay. I don't plan on ever purchasing Robux this way, so I'd rather just disable it if I can.</p>

<section>
<h2>Initial Attempt</h2>
<p>I started with the searching Defined Strings for "InsufficientRobux":</p>
                
                
```
s_InsufficientRobux_00cd45cb                    XREF[1]:     078c26c0(*)  
00cd45cb 49 6e 73        ds         "InsufficientRobux"

PTR_s_InsufficientRobux_078c26c0                XREF[1]:     _INIT_446:0324c15d(R)  
078c26c0 cb 45 cd        addr       s_InsufficientRobux_00cd45cb
```

                
<p>Assembly shows string being loaded with MOVUPS:</p>
                
```
0324c15d 0f 10 05        MOVUPS     XMM0,xmmword ptr [PTR_s_InsufficientRobux_078c]
5c 65 67 04
```

                
<p>This led to <code>_INIT_446</code>, which is initialization code for setting up strings. Not the purchase logic we need.</p>
</section>

<section>
<h2>Second Attempt</h2>
<p>Tried "PurchasePromptShown" instead:</p>
                
                
```
s_PurchasePromptShown_00d63b43                  XREF[1]:     init_gui_service:05a81784(*)  
00d63b43 50 75 72        ds         "PurchasePromptShown"
```

                
<p>Referenced in <code>init_gui_service</code> - the GUI system initialization function.</p>
</section>

<section>
<h2>GUI Service Registration</h2>
<p>Found the purchase prompt handler registration in <code>init_gui_service</code>:</p>
                
                
```
FUN_06f69d70(&DAT_07f3dad0,uVar3,"SetPurchasePromptIsShown",8);
_DAT_07f3dad0 = &PTR_FUN_07b87bc0;
_DAT_07f3db50 = set_purchase_prompt_shown_handler;
_DAT_07f3db58 = 0;
DAT_07f3db60 = 0;

FUN_05a6c3b0(&DAT_07f3dad0,"isShown",&local_98);
```

                
<p>This registers:</p>
<ul>
<li>Function name: <code>"SetPurchasePromptIsShown"</code></li>
<li>Handler: Function at <code>05982f60</code> (renamed to <code>set_purchase_prompt_shown_handler</code>)</li>
<li>Parameter: <code>"isShown"</code> (boolean)</li>
</ul>
                
<p>Event registration:</p>
                
```
FUN_05a69340(&DAT_07ce0770,0x188,"PurchasePromptShown",8);
```

</section>

<section>
<h2>Call Chain</h2>
<p>The purchase prompt flow:</p>
<ol>
<li>Game calls <code>SetPurchasePromptIsShown(isShown=true)</code></li>
<li>Triggers handler function at address <code>05982f60</code></li>
<li>Calls display function at <code>05982f6b</code> (renamed to <code>show_purchase_prompt</code>)</li>
<li>Fires <code>PurchasePromptShown</code> event</li>
</ol>
                
<p>The handler function checks the isShown parameter and calls the display function if true.</p>
</section>

<section>
<h2>Implementation Notes</h2>
<p>The <code>init_gui_service</code> function contains dozens of similar GUI handler registrations. Each follows the same pattern of registering a function name, handler, and parameters.</p>
</section>
