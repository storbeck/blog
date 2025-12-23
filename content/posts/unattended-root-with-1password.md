---
title: "Give Claude Code Unrestricted Root (via 1Password) — Dangerous, Test‑Only"
description: "Security engineering note: how to let Claude Code (or similar agents) obtain root without prompts using a 1Password service account and op CLI. Extremely risky; test-only with strong safeguards."
date: "2025-10-15"
category: "Security"
legacyUrl: "/posts/2025-10-15-unattended-root-with-1password.html"
---

<section aria-labelledby="warning">
<h2 id="warning">Use at Your Own Risk</h2>
<p><strong>This is dangerous.</strong> The pattern below lets a coding agent like <strong>Claude Code</strong> (or similar) obtain <code>sudo</code> credentials non‑interactively. Only consider this in isolated environments (throwaway VMs, local sandboxes) where you fully accept the risk. Do not do this on production systems. Prefer safer alternatives listed later.</p>
</section>

<section aria-labelledby="why">
<h2 id="why">Why Do This?</h2>
<p>Some agents or automation flows (e.g., Claude Code) need to run commands that require root. Permission prompts block progress in non‑interactive modes. A 1Password service account can gate access to the password and provide audit logs, while the agent retrieves it on demand.</p>
</section>

<section aria-labelledby="prereqs">
<h2 id="prereqs">Prerequisites</h2>
<ul>
<li>1Password account with permission to create a service account</li>
<li>1Password CLI installed (<a href="https://developer.1password.com/docs/cli/" rel="external noopener noreferrer">docs</a>)</li>
<li>Isolated test environment; you accept full risk</li>
</ul>
</section>

<section aria-labelledby="steps">
<h2 id="steps">Steps</h2>
<ol>
<li>
Create a dedicated vault for automation (example: <strong>dev</strong>). Avoid using your personal vault with service accounts.
</li>
<li>
In that vault, create a new password item named <strong>sudo</strong>:
<dl>
<dt>Title</dt><dd><code>sudo</code></dd>
<dt>Username</dt><dd><code>root</code></dd>
<dt>Password</dt><dd>Your root password</dd>
</dl>
</li>
<li>
Create a 1Password <em>service account</em> scoped only to the <strong>dev</strong> vault (read‑only).
See: <a href="https://developer.1password.com/docs/service-accounts/get-started/" rel="external noopener noreferrer">Service accounts guide</a>.
</li>
<li>
Save the service account token in your shell environment (e.g., in a local <code>.env</code>):
            
```
OP_SERVICE_ACCOUNT_TOKEN="...your_token..."
```

</li>
<li>
Retrieve the sudo password via the 1Password CLI when needed:
            
```
export OP_SERVICE_ACCOUNT_TOKEN
op read "op://dev/sudo/password"
```

</li>
</ol>
<p>You can embed these instructions into your agent’s runbook (for example, a <code>CLAUDE.md</code> note) describing how to request elevated actions. Again: <strong>test environments only</strong>.</p>
</section>

<section aria-labelledby="risk">
<h2 id="risk">Risks, Audit, and Hygiene</h2>
<ul>
<li><strong>Exposure:</strong> Any process with the service account token can read items from the scoped vault.</li>
<li><strong>Scope strictly:</strong> Create a dedicated vault with only the minimum items; grant read‑only to the service account.</li>
<li><strong>Rotate and revoke:</strong> Treat the token as a secret. Rotate frequently; revoke when done.</li>
<li><strong>Use audit logs:</strong> 1Password logs access; review them when testing this flow.</li>
</ul>
</section>

<section aria-labelledby="safer">
<h2 id="safer">Safer Alternatives (Prefer These)</h2>
<ul>
<li><strong>Limit with sudoers:</strong> Grant NOPASSWD for a small, explicit command allowlist instead of full root password.</li>
<li><strong>Ephemeral machines:</strong> Run in disposable VMs/containers; destroy after each session.</li>
<li><strong>Session escalation only:</strong> Prompt a human to approve specific commands; avoid storing passwords altogether.</li>
<li><strong>Non‑root strategies:</strong> Use capabilities, file ACLs, or service users with least privilege.</li>
</ul>
</section>

<section aria-labelledby="summary">
<h2 id="summary">Summary</h2>
<p>This pattern enables unattended root in constrained scenarios by letting an agent fetch credentials through a tightly scoped 1Password service account. It is powerful and risky. Prefer safer alternatives; if you proceed, isolate, scope, audit, and clean up.</p>
</section>
