---
title: "Why Your Design Sucks"
description: "Why data pipelines shouldn’t dictate your UI: a frontline take on designing around user intent instead of backend constraints."
date: "2026-01-27"
category: "UX, Product"
legacyUrl: "/posts/2026-01-27-why-your-design-sucks.html"
---

<section itemprop="articleBody">
<p>I have spent more than 15 years building frontends. I have worked with designers who can make a layout sing, UX researchers who map flows that feel so obvious but yet it was missed by everyone, and backend teams who keep the data performance humming. The most common reason the final product disappoints is not talent. It is order. In many teams I have worked with, we keep building software from the bottom up.</p>

<p>The usual story goes like this. The business has a need. The team gets data, either by collecting it themselves or by integrating with vendors. Then they normalize and enrich it. Then they build APIs. Then, at the end, they build the UI on top of whatever the data can reasonably return. The UI often becomes a client of the API and the API becomes the product.</p>

<p>That is how you often get software that feels like a database wearing a jacket. It can be correct and still be painful to use. It can be comprehensive and still feel narrow. It can look polished and still leave users stuck in the middle of a task, wondering why the system refuses to meet them where they are.</p>
</section>

<section>
<h2>The Conveyor Belt Nobody Questions</h2>
<p>I have seen the data-first conveyor belt in startups and in enterprise teams. It looks efficient on paper because every step has visible artifacts. You can demo an ingestion pipeline. You can show an API in a swagger doc. You can point to a schema. UX work is harder to show, so it gets deferred. By the time the UI arrives, the flow is boxed in by what the data model can produce. You are no longer asking, "What should the user be able to do?" You are asking, "How do we display this data without breaking the API?"</p>

<p>I have watched teams spend months building an ingestion pipeline and then rush the frontend in a few sprints. The UI becomes a set of screens that explain the system instead of a tool that gets work done. The user is forced to learn the product&rsquo;s internal language. They learn your taxonomy, your IDs, your field names. That is a signal that the design failed.</p>

<p>We keep doing data-first design because it feels concrete. Data is measurable. Pipelines can be scheduled. APIs can be versioned. UX is messier. It forces you to make tradeoffs that do not fit neatly into a backlog. It requires talking to users, not just reading specs. It forces you to say no to internal complexity. There is also a cultural bias. The first hires are often backend engineers. They build the foundation, and the foundation becomes the product. Product managers feel pressure to show progress, so the early wins are usually technical milestones: integration complete, pipeline live, API documented. UX shows up later, when it is already too expensive to change the order. That is why so many UIs read like a database schema. Field names leak into the interface. Taxonomy becomes a feature. The system is internally consistent and externally confusing.</p>
</section>

<section>
<h2>Agile Timing Is Not Sequencing</h2>
<p>Agile culture compounds the problem. Everyone shows up at the same sprint planning meeting. Designers bring the visuals. Product brings the must-have metrics. Engineering brings the API and pipeline constraints. It is called cross-functional, but in practice it means each group built a different map in a different order.</p>

<p>When the sprint ends, all those maps collide. The result is a compromise that fits the timebox, not the user. The missing pieces are promised in a &ldquo;fast follow.&rdquo; I have heard that phrase so many times, and the fast follow never happens. I think it really means "we've considered this, but it's too complex, so let's worry about it after we get complaints." It is the most expensive sentence in software because it postpones the hard work. It makes design debt invisible until it is too expensive to pay.</p>

<p>Agile is not the villain. The villain is using timing as a substitute for sequencing. You can move fast and still do the wrong thing first. A sprint is not a strategy.</p>
</section>

<section>
<h2>What Users Actually Want</h2>
<p>Steven Krug&rsquo;s most famous line is &ldquo;Don&rsquo;t make me think.&rdquo; Don Norman has spent his career explaining mental models and why systems that fight them create confusion. Jakob Nielsen has documented the same problem from a usability lens for decades. They are all pointing at the same truth: people do not want to learn your system. They want to accomplish a task without friction.</p>

<p>When someone opens your product, they are not thinking about your data sources. They are thinking about their job. The correct first design artifact is not a schema. It is a task. What are the top three things the user is trying to do? How do they describe those tasks in their own words? What do they need to see first? What can be hidden? What happens if the data is incomplete?</p>

<p>If you cannot answer those questions, any data model you build is just a guess.</p>
</section>

<section>
<h2>Where UX Goes To Die</h2>
<p>The exact point where UX often dies is easy to spot if you have lived through it. The design prototype supports a clean flow. The API does not return the data in the right shape. To fix it, you need changes in the pipeline, new endpoints, and maybe a rework of the canonical model. That takes weeks. The release is in two sprints. So you do a UI workaround.</p>

<p>You add a second screen. You split the flow. You ask the user to pick from a list that only exists because the data is grouped by an internal key. It is still possible to complete the task, but it is no longer smooth. The user now has to learn your constraints, not just their own goal.</p>

<p>A good frontend developer can mitigate some of this. I have preloaded data, cached aggressively, built client-side maps, and delayed rendering to hide latency. Those tricks help, but they are still bandages. The root issue is architectural. The UI is constrained by the API and the API is constrained by the data pipeline. The result is a product that is technically correct and experientially wrong.</p>
</section>

<section>
<h2>The Myth Of The Thin UI</h2>
<p>I still hear people say the UI is just a thin layer on top of the backend. That is a convenient fiction. The UI is where the user&rsquo;s mental model meets your architecture. If the UI is painful, it is not just a frontend issue. It is an architecture issue.</p>

<p>API-first is a good engineering practice when the API truly serves multiple clients. It is a bad product practice when it becomes the only source of truth. For pure reporting tools, data-first can be fine if the task is literally data inspection. If the best user flow requires a new endpoint or a different data shape, the right move is to change the API, not to make the flow worse.</p>

<p>Teams that treat the UI as a first-class design surface do not just build nicer screens. They build better systems, because the system has to support real use, not just raw data access.</p>
</section>

<section>
<h2>A Simple Litmus Test</h2>
<p>Try this with your own product. Ask a user to narrate what they are doing right now in the app. Write down the exact words they use. Then compare those words to your UI labels and flows. If the language does not match, the UX is going to feel unnatural. If the steps they describe do not map cleanly to your screens, the UX is going to feel slow.</p>

<p>Users do not say, &ldquo;I need to filter by account_id and join on campaign_id.&rdquo; They say, &ldquo;I want to see how the ads did last week.&rdquo; They do not think in tables. They think in goals. When the UI forces them to think in tables, you have made them do extra work that the software should do for them.</p>
</section>

<section>
<h2>The Cost Of Data-First Design</h2>
<p>Data-first design has predictable symptoms. The system is correct but awkward, flexible in the wrong ways, and slow to improve because fixes require changing pipelines and APIs. You can ship like this and still win on features, but you will often lose on trust. People do not stick with tools that feel like work, and that has a cost you can measure in churn and support tickets.</p>
</section>

<section>
<h2>What UX-First Actually Means</h2>
<p>UX-first does not mean pretty. It does not mean animations. It means you design the system around how people work, and then you make the data model serve that workflow.</p>

<p>Here is what that sequence looks like when it is done well:</p>

<p><strong>Start with tasks.</strong> Define the top jobs in plain language. If the product is not great at those, it is not done.</p>

<p><strong>Map the flow.</strong> Sketch the steps. Identify where the user needs to choose, where they need feedback, and where they need reassurance. Do it before you design endpoints.</p>

<p><strong>Model the data around the flow.</strong> Decide what data is needed to support those steps. If it does not exist, that is a backend requirement, not a UI workaround.</p>

<p><strong>Build APIs that serve the task.</strong> A good API presents user concepts, not just tables. It can still expose raw data, but the primary endpoints should match how the product is used.</p>

<p>None of that is radical. It just requires discipline to delay the data model until you know what the user actually needs.</p>
</section>

<section>
<h2>The Design System Trap</h2>
<p>Design systems are useful. They reduce inconsistency and speed up delivery. But they are not a substitute for good UX. A consistent interface can still be consistently confusing. If the flow is wrong, the design system only makes the wrong flow easier to ship.</p>

<p>I have seen teams celebrate that all their screens use the same components while users still get lost.</p>
</section>

<section>
<h2>The Unsexy Part: Constraints</h2>
<p>UX work forces you to make decisions. It tells you to cut features, to hide options, to pick defaults, to say no to internal complexity. Data-first design is attractive because it avoids those decisions. It treats the data as neutral and lets the UI figure it out later. That is how you end up with a product that does everything and helps no one.</p>

<p>A good product is opinionated. It decides what matters. It turns raw data into clear answers. It compresses complexity into a flow that fits a real day, not a schema diagram.</p>
</section>

<section>
<h2>What I Have Seen Work</h2>
<p>The best teams I have worked with did not have some magic process. They made a few practical decisions and stuck to them.</p>

<p><strong>Prototype the flow before the API.</strong> Not a pixel-perfect design. A clickable flow that can be tested and debated.</p>

<p><strong>Run quick usability sessions early.</strong> Five people can save months of rework. If they stumble, the flow is wrong.</p>

<p><strong>Turn UX findings into backend requirements.</strong> If the user needs a summary view, compute it in the pipeline. Do not make the frontend stitch it together.</p>

<p><strong>Stop using &ldquo;fast follow&rdquo; as a crutch.</strong> If the flow is wrong, fix it before shipping. The same mistakes are rarely cheaper later.</p>

<p>These steps are not glamorous. They are slow in the right places so you can be fast in the right places later.</p>
</section>

<section>
<h2>A Word For The Team</h2>
<p>If you are a PM, your job is to ship an experience, not just a roadmap. If you are an engineer, especially backend, remember every data model decision is a UX decision. If you are a designer, your leverage comes from the flow more than the polish. The best teams I have seen treat these as shared responsibilities and decide on the user story before they freeze the model.</p>
</section>

<section>
<h2>Why Your Design Sucks</h2>
<p>I called this essay &ldquo;Why Your Design Sucks&rdquo; because the problem is structural, not cosmetic. Your design does not suck because your designers are bad. It sucks because the system was built in the wrong order.</p>

<p>When software is built around data pipelines, the UI becomes a translation layer instead of a tool. The product feels like a report, not a workflow. The fix is not a redesign. It is a sequence change:</p>

<p><strong>Start with tasks, not data.</strong></p>
<p><strong>Model the data around those tasks.</strong></p>
<p><strong>Build APIs that serve the flow.</strong></p>
<p><strong>Design the UI to make the tasks easy.</strong></p>

</section>

<section>
<h2>Final Thought</h2>
<p>I have built UIs that I am proud of and I have built UIs that I knew were wrong but could not fix because the API was already frozen. The hard lesson is that design is not where the product ends. Design is where it starts.</p>

<p>If you want better software, stop treating the UI as a client of your data. Treat it as the reason your data exists.</p>
</section>
