---
title: "ARM64 Assembly and Ghidra Analysis Basics"
description: "ARM64 assembly basics and Ghidra analysis techniques learned from analyzing Roblox purchase prompt system"
date: "2025-10-10"
category: "Reverse Engineering"
legacyUrl: "/posts/2025-10-10-manual-ghidra-analysis.html"
---

<p>Notes from analyzing Roblox purchase system binaries. Covers ARM64 assembly fundamentals, Ghidra navigation patterns, and common C++ binary structures.</p>

<section>
<h2>ARM64 Basics</h2>

<h3>Registers</h3>
<p>ARM64 has two views of the same registers:</p>
<dl>
<dt><code>x0</code> through <code>x30</code></dt>
<dd>64-bit general purpose registers</dd>

<dt><code>w0</code> through <code>w30</code></dt>
<dd>Lower 32 bits of corresponding x register</dd>
</dl>

<p>Writing to a <code>w</code> register clears the upper 32 bits of the <code>x</code> register. They reference the same physical register.</p>

<h3>Special Purpose Registers</h3>
<dl>
<dt><code>sp</code></dt>
<dd>Stack pointer - points to top of stack</dd>

<dt><code>x29</code></dt>
<dd>Frame pointer - marks base of current function's stack frame</dd>

<dt><code>x30</code></dt>
<dd>Link register - holds return address after branch with link</dd>

<dt><code>x0-x7</code></dt>
<dd>Function arguments and return values</dd>
</dl>

<h3>Common Instructions</h3>
<dl>
<dt><code>stp x29, x30, [sp, #-0x20]!</code></dt>
<dd>Store pair - saves two registers to stack, decrements sp</dd>

<dt><code>ldp x29, x30, [sp], #0x20</code></dt>
<dd>Load pair - restores two registers from stack, increments sp</dd>

<dt><code>adrp x8, 0x104b10000</code></dt>
<dd>Load page address - gets base of 4KB memory page</dd>

<dt><code>add x8, x8, #0x50</code></dt>
<dd>Add immediate to complete full 64-bit address after adrp</dd>

<dt><code>bl FUN_10039d6b58</code></dt>
<dd>Branch with link - calls function, saves return address in x30</dd>

<dt><code>ret</code></dt>
<dd>Return - branches to address in x30</dd>
</dl>

<h3>The Stack</h3>
<p>Stack stores local variables, saved registers, and return addresses. Grows downward (toward lower addresses).</p>

<p>Typical function prologue:</p>
                
```
stp x29, x30, [sp, #-0x20]!  ; Save frame pointer and return address
mov x29, sp                      ; Set new frame pointer
sub sp, sp, #0x450               ; Allocate stack space
```


<p>Typical epilogue:</p>
                
```
add sp, sp, #0x450               ; Free stack space
ldp x29, x30, [sp], #0x20        ; Restore frame pointer and return address
ret                               ; Return to caller
```

</section>

<section>
<h2>Ghidra Navigation</h2>

<h3>Function vs Label</h3>
<dl>
<dt><code>FUN_</code></dt>
<dd>Function entry point - callable subroutine</dd>

<dt><code>LAB_</code></dt>
<dd>Label - branch target inside a function (loops, conditionals)</dd>
</dl>

<h3>Cross References (XREF)</h3>
<p>Right-click any symbol → Show References to. Shows where functions are called or data is accessed.</p>

<p>Example:</p>
                
```
s_ProximityPrompt_Triggered_1040cc7a7    XREF[1]: 10191adc4(*)
1040cc7a7    "ProximityPrompt_Triggered"
```


<p>XREF shows this string is referenced from address 0x10191adc4.</p>

<h3>String Search</h3>
<p>Search → For Strings to find text. Search → For Bytes to find byte patterns or consecutive zeros (code caves).</p>
</section>

<section>
<h2>C++ Binary Patterns</h2>

<h3>Small String Optimization</h3>
<p>libc++ std::string layout:</p>
<table>
<thead>
<tr>
<th>Offset</th>
<th>Field</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td>+0x00</td>
<td>data pointer</td>
<td>Points to string data (if heap allocated)</td>
</tr>
<tr>
<td>+0x08</td>
<td>size</td>
<td>String length</td>
</tr>
<tr>
<td>+0x18</td>
<td>inline buffer</td>
<td>Small strings stored here</td>
</tr>
<tr>
<td>+0x17</td>
<td>flag byte</td>
<td>Bit 7 set = heap allocated, else inline</td>
</tr>
</tbody>
</table>

<p>Common pattern in decompiled code:</p>
                
```
if (local_71 < '\0') {
FUN_1039f9090(local_88);  // Free heap-allocated string
}
```


<p>This checks the sign bit of the flag byte to determine storage type.</p>

<h3>Simple Getters</h3>
<p>Libraries use accessor functions to keep structures opaque:</p>

                
```
undefined8 FUN_103aaf480(long param_1)
{
return *(undefined8 *)(param_1 + 0x40);
}
```


<p>Reads 8-byte value at offset 0x40 from structure. Common pattern for internal data access.</p>

<h3>Reference Counting</h3>
<p>Shared pointer patterns:</p>
                
```
LOAcquire();
lVar2 = plVar3[1];
plVar3[1] = lVar2 + -1;
LORelease();
if (lVar2 == 0) {
(**(code **)(*plVar3 + 0x10))(plVar3);
__ZNSt3__119__shared_weak_count14__release_weakEv(plVar3);
}
```


<p>Decrements reference count atomically. Calls destructor when count reaches zero.</p>
</section>

<section>
<h2>HTTP Request Patterns</h2>

<h3>Host Resolution</h3>
<p>Each service has wrapper function:</p>

                
```
void Get_Host_Service(void) {
Http_ResolveHost("service_name");
}
```


<p>Core resolver constructs full domain based on service name and environment.</p>

<h3>Request Building</h3>
<p>Standard pattern:</p>
                
```
std::string host = Get_Host_Service();
std::string path = "/api/endpoint";
std::string url = Http_BuildUrl("https", host, path, query);
Http_SubmitRequest(ctx, url);
```


<h3>Subdomain Validation</h3>
<p>Subdomain checking function validates if host matches suffix at domain boundaries:</p>

                
```
bool HostIsSubdomainOf(const std::string& host, const char* suffix)
```


<p>Returns true if:</p>
<ul>
<li>Host exactly matches suffix, or</li>
<li>Host ends with <code>.suffix</code>, and</li>
<li>Optional <code>:port</code> allowed after suffix</li>
</ul>
</section>

<section>
<h2>Logging Infrastructure</h2>

<p><code>FLog_LogFmt</code> at 0x1039d6b58 - main logging function with 4578 cross-references.</p>

<p>Function signature:</p>
                
```
void FLog_LogFmt(
void* logger_ctx,      // Logger context
void* logger_sink,     // Output sink
int level,             // Log level (5 = info)
const char* fmt,       // Format string
size_t fmt_len,        // Format string length
int tag,               // Category tag
void* arg0,            // First format argument
uint32_t nargs         // Number of arguments
)
```


<p>Example usage:</p>
                
```
FLog_LogFmt(_DAT_10507bd58, DAT_10507bd60, 5,
"[FLog::WebLoginProtocol] {}", 0x1b, 0xd,
&stringVar, 1);
```


<p>Format strings use <code>{}</code> placeholders. Function is called with level 5 (info) for most operational logging.</p>
</section>

<section>
<h2>Reflection System</h2>

<p>Roblox uses metaclass architecture for properties:</p>

<h3>Property Setter Pattern</h3>
                
```
bool SetPropertyByName(
Instance* instance,
const char* propertyName,
ClassDescriptor* cls,
int flags,
bool quiet)
{
ClassDescriptor* cd = FindClassDescriptor(cls);
if (!cd) return false;

PropertyDescriptor* pd = FindPropertyDescriptor(cd, propertyName);
if (!pd) return false;

PropertyInstance* p = CreatePropertyInstance(instance, pd);
p->flags = flags;
return true;
}
```


<p>Uses runtime lookup of class and property descriptors. Error messages "Could not find class descriptor" or "Could not find property descriptor" indicate reflection failures.</p>
</section>

<section>
<h2>OpenSSL Components</h2>

<p>Some functions identified as OpenSSL Base64 BIO filter based on:</p>
<ul>
<li>Assert strings: <code>assertion failed: ctx->buf_len <= (int)sizeof(ctx->buf)</code></li>
<li>File path: <code>crypto/evp/bio_b64.c</code></li>
<li>Function patterns matching <code>b64_write()</code> and <code>b64_read()</code></li>
</ul>

<p>Context structure fields: <code>buf_len</code>, <code>buf_off</code>, <code>tmp_len</code>, <code>init</code>.</p>
</section>

<section>
<h2>Analysis Techniques</h2>

<h3>String-Based Discovery</h3>
<p>Start with known strings:</p>
<ol>
<li>Search for error messages, API paths, or feature names</li>
<li>View cross-references to find usage</li>
<li>Examine calling functions</li>
<li>Rename functions based on context</li>
</ol>

<h3>Pattern Recognition</h3>
<p>Host resolution wrappers all follow pattern:</p>
                
```
void Get_Host_<Service>(void) {
FUN_1039319c0("<service>");
}
```


<p>HTTP request builders follow:</p>
                
```
Get_Host_<Service>(&host);
Http_BuildUrl(&url, "https", host, path, query);
Http_SubmitRequest(ctx, url);
```


<h3>Function Renaming</h3>
<p>Renaming improves readability. Example:</p>

<p>Before:</p>
                
```
lVar2 = FUN_100242e24(param_1);
```


<p>After renaming to <code>GetLocalPlayer</code>:</p>
                
```
lVar2 = GetLocalPlayer(param_1);
```


<p>Context from surrounding code and variable usage indicates function purpose.</p>
</section>

<section>
<h2>Ghidra Patching</h2>

<h3>Code Caves</h3>
<p>Executable memory regions with unused space. Search for consecutive 0x00 bytes in __TEXT segment.</p>

<p>Requirements:</p>
<ul>
<li>Must be in initialized memory (not <code>??</code>)</li>
<li>Must have execute permission</li>
<li>Size depends on patch - typically need 0x40-0x80 bytes</li>
</ul>

<h3>Uninitialized vs Initialized</h3>
<dl>
<dt><code>??</code> in Ghidra</dt>
<dd>Uninitialized memory - cannot assemble code here</dd>

<dt>Hex bytes (blue)</dt>
<dd>Initialized memory - can patch and export</dd>
</dl>

<p>Use Patch Program → Fill to initialize regions before assembling.</p>

<h3>ARM64 Address Loading</h3>
<p>Cannot fit 64-bit address in 4-byte instruction. Two methods:</p>

<p>Method 1 - adrp/add for page-relative:</p>
                
```
adrp x3, 0x10507b000
add  x3, x3, #0xd58
```


<p>Method 2 - movz/movk for absolute:</p>
                
```
movz x3, #0xB37C              // Bits 0-15
movk x3, #0x063D, lsl #16    // Bits 16-31
movk x3, #0x0001, lsl #32    // Bits 32-47
```


</section>


<section>
<h2>Manual Analysis Workflow</h2>

<p>Steps for tracing function purpose:</p>
<ol>
<li>Find relevant strings</li>
<li>Check cross-references</li>
<li>Examine calling context</li>
<li>Decompile to C</li>
<li>Ask ChatGPT about unfamiliar patterns</li>
<li>Rename based on usage</li>
<li>Trace related functions</li>
</ol>

</section>
