<script setup lang="ts">
useHead({
  title: 'About - Geoff Storbeck',
  meta: [
    {
      name: 'description',
      content: "Background, interests, and the story behind Geoff Storbeck's blog."
    }
  ]
})
</script>

<template>
  <div class="page-shell">
    <SiteMasthead active="about" />
    <main class="interior-main">
      <article itemscope itemtype="http://schema.org/Person">
      <header class="about-hero">
        <figure class="about-photo">
          <picture>
            <source
              type="image/webp"
              srcset="/images/profile-400w.webp 400w, /images/profile-800w.webp 800w, /images/profile-1200w.webp 1200w"
            >
            <source
              type="image/jpeg"
              srcset="/images/profile-400w.jpg 400w, /images/profile-800w.jpg 800w, /images/profile-1200w.jpg 1200w"
            >
            <img
              src="/images/profile-400w.jpg"
              alt="Geoff Storbeck profile photo"
              width="400"
              height="400"
              loading="eager"
              decoding="async"
            >
          </picture>
        </figure>
        <h1>About Geoff</h1>
      </header>

      <p itemprop="description">
        I build approachable, content-first interfaces as a freelance frontend developer based in Ormond Beach, Florida.
        My career spans web hosting, fintech, and offensive security, with a through-line of UI work that turns complex
        systems into clear workflows.
      </p>
      <p>
        For frontend contract work, I take projects through PageFoundry LLC. Hire me at
        <a href="https://pagefoundry.dev" rel="external">pagefoundry.dev</a>.
      </p>
      <p>
        Most recently I led the frontend rewrite of Praetorian's Chariot platform, moving delivery from monthly releases
        to same-day deploys while building a React, TypeScript, and TailwindCSS architecture the team could extend
        quickly. At JPMorgan Chase I built the Cassandra as a Service UI and the Account Lifecycle Management UI, and I
        rewrote an embedded Angular 1 app into a standalone React and Redux application to lower onboarding friction and
        raise performance.
      </p>
      <p>
        I run PageFoundry LLC, a small UI-focused consultancy, and I am currently building a graph database IDE with a
        team that connects to Neo4j, JanusGraph, Datastax, Kuzu, and RDF backends through a single interface. My day to
        day tools include React, TypeScript, HTML, CSS, and Vue when the product calls for it.
      </p>

      <section aria-labelledby="about-background">
        <h2 id="about-background">How I got here</h2>
        <p>
          It started at the kitchen table with a beige tower humming in the corner. I would dial into the library
          catalog from home and land in Dynix, the same screen the librarians used. The interface asked its questions in
          tidy rows. Type a title, hit enter, and it would hand back an aisle and a shelf like a set of coordinates.
        </p>
        <p>
          The next day I would be back in the stacks with how-to-draw books under my arm, flipping pages that smelled
          like paper and dust. At night I went back to the catalog to explore the system. I found the jump address to
          the Library of Congress and spent time reading papers that felt out of reach for a kid in a small town. It
          felt official just to log in. I remember reading about Bin Laden after the U.S. embassy bombings in 1998 while
          he was climbing the FBI's most wanted list.
        </p>
        <p>
          We finally had Windows 95, then Windows 98. A friend showed me you could right click a web page, save it, open
          the HTML in Notepad, and change it. I built the first versions by hand, then moved to FrontPage and went on a
          streak of half finished sites that never went anywhere. I did not have money for hosting, so nothing ever went
          live. I would finish one, admire it for a day, then delete it and start over because the building was the fun
          part.
        </p>
        <p>
          That phase burned out and I slid into games. I picked up Legends of Might and Magic at Micro Center and spent
          my nights playing it. I got decent, climbed the ladders, then the hackers showed up and started shooting
          through walls. I called one out in chat and asked how he was doing it. He answered, then invited me onto IRC
          to talk more. He taught me mIRC scripting so I could greet people as they joined my room. He also showed me
          how to open the game files in a hex editor and change values like weapon strength, range, and walk speed. It
          was all client side logic. It was easy to open, easy to bend, and it made the machine feel knowable.
        </p>
        <p>
          IRC felt like stepping into a room full of people who were smarter, weirder, and funnier than anyone I knew.
          The programmers I met there had the nerdiest humor I had ever heard and a kind of edge that felt cool from a
          distance. They traded the Anarchist Cookbook, listened to German techno, and dropped references that went over
          my head. I learned about 2600 from them and started trying to listen to Off the Hook out of New York whenever I
          could.
        </p>
        <p>
          The same crowd kept talking about real programming and how Windows would never cut it. You needed free
          compilers like gcc, actual performance, endless customization. One day I burned the Red Hat Linux 7.3 ISOs,
          codename Seahorse, onto CDs and wiped the drive. I booted into the installer, partitioned the disk by hand,
          and watched it finish. When it dropped me at a bash prompt in GNOME, it felt like crossing a line I could not
          uncross.
        </p>
        <p>
          The next few years were a blur of distro hopping. Red Hat to Fedora when it split off, then Mandrake because
          it felt friendlier, Debian for stability, Slackware to prove I could handle it, Gentoo when I wanted to
          compile everything from source. Desktop environments were the same obsession. GNOME, then KDE because it
          looked flashier, then down to lightweight setups like Fluxbox, Blackbox, Openbox, and IceWM.
        </p>
        <p>
          I cared about the aesthetics as much as the tools. I would spend entire weekends tweaking my setup, changing
          terminal prompt colors to match the wallpaper, hunting down the perfect Fluxbox theme, making sure Firefox and
          GTK looked like they belonged together. Conky on the desktop, a weather applet in the corner, gDesklets,
          SuperKaramba, anything new from Freshmeat or the forums. I would post a fresh setup and wait for the clean
          comments to roll in. Everything had to match, feel cohesive, like the machine was an extension of my mood that
          month.
        </p>
        <p>
          High school was a small Catholic school, so the computer offerings were basic. No Cisco track, no lab stacks.
          They did have programming classes, and I signed up for every one. I breezed through them and loved it. The
          teacher could tell I was ahead from messing around at home, so he gave me extra challenges and let me run with
          my own projects. We ended up becoming friends. I would hang out after class, talking shop and showing him
          random Linux tricks.
        </p>
        <p>
          Senior year, the big project was Dreamweaver. He was supposed to teach it the next year but did not feel
          confident yet, so he had me learn it inside and out, then teach it back to him. I demoed features, walked him
          through layouts, explained how to export clean code instead of the bloated defaults. It was a blast. It was my
          first real taste of teaching tech to someone else.
        </p>
        <p>
          Graduation came with a reality check. No money for a four year school and my grades were not Ohio State
          material. The plan was Columbus State Community College, get an associate's in computer science, then transfer
          to OSU. CSCC was close, affordable, and had a decent program with programming classes, sysadmin work, and web
          dev that was finally catching up to what I had been teaching myself.
        </p>
        <p>
          Freshman year was a grind. I was taking a full load and keeping grades high for the transfer. Money was tight,
          so I took a part time job at a call center for Jumpline.com, a web hosting company in Columbus. It started as
          basic support, then escalated tickets, then outages, abuse reports, and security patches. I picked it up fast
          and started getting pulled deeper into the real work.
        </p>
        <p>
          The job became my real education. Nights and weekends I was in the data center racking servers, configuring
          Cisco switches for VLANs, researching RAID setups, and writing bash scripts to automate migrations. I built
          tools for duplicating servers without downtime. I learned systems administration in production, not in a lab.
          That part time call center job stretched into a full systems admin role, and I had real experience on my resume
          before I finished the associate's.
        </p>
        <p>
          Balancing full time school and a job that kept expanding was brutal. I would leave class, head straight to
          work, handle tickets until late, then try to cram homework into whatever hours were left. Sleep suffered,
          grades slipped, and I could feel the burnout building. I had to make a call. A degree would always be there,
          but real world experience in a growing hosting company was not guaranteed to wait.
        </p>
        <p>
          I chose the job. I dropped classes, went full time at Jumpline, and kept climbing. The responsibilities grew
          fast. Data center migrations, internal tools, abuse and security work, projects that touched every server in
          the fleet. Every new challenge taught me more than a semester ever could, and the paycheck finally let me
          breathe. I told myself I would circle back to finish the degree someday when life slowed down. For now, the
          momentum was everything.
        </p>
        <p>
          I was hooked.
        </p>
      </section>
      </article>
    </main>
  </div>
</template>
