---
title: "AI-generated music isn't doing it for me"
description: "A personal note on AI music fatigue, distrust of rec engines, and using Wikidata queries to browse like a record store."
date: "2026-1-5"
category: "Journal"
legacyUrl: "/posts/2026-1-5-ai-music-rdf-sparql.html"
---

<section>
<p>That moment when YouTube auto-advances after a song and drops me into some "Chill Study Mix Vol. 8" with generic thumbnail art and a title that feels algorithmically focus-grouped. I just know it's going to be a sound that's been sanded down smooth. I can't take it any longer, it's the sameness. The system is trying way too hard to convince me I already like what's coming next.</p>
</section>

<section>
<p>AI-generated music just feels generic and empty to me. Competent wallpaper, nothing more. I'm not making a moral case here. I don't hate AI; I use it constantly. I just don't want it deciding what music I hear.</p>
<p>I don't trust recommendation engines or SEO-driven discovery to show me anything except the safe, optimized middle.</p>
</section>

<section>
<p>I didn't set out to "fix" music discovery with RDF/SPARQL. It started because I was curious about the differences between LPG (label property graph) and RDF (resource description framework). Marc Lieber's demo on Apache Jena and Fuseki, running SPARQL queries against Wikidata and stitching in local data without dragging the whole dataset down. He used a small dataset of French Impressionist painters joined to remote endpoints and only pulled what he needed, no firehose required.</p>
<p>The other one was Tara Raafat's talk on RDF and OWL. She used a fraud detection example in maritime trade: investigators cross-referencing bills of lading against public marine traffic data to spot ships taking odd detours that didn't match the paperwork. While working in Fintech, I've been through my share of Anti-Money Laundering training, but it's neat to see how it's actually accomplished on a technical level. I was inspired by the use of open-source data and the semantic web to solve real world issues.</p>
<p>I ended up liking the whole RDF idea more than I expected. It feels like a sustainable way to handle shared data, no proprietary lock-in. These things have been around for over a decade, and the examples still hold up.</p>
</section>

<section>
<p>Querying Wikidata felt different from searching Google. Google argues with what I type and forces the loudest, most clickable answer. Wikidata is more like flipping through dusty record store bins -- messy, sometimes missing obvious stuff, occasionally wrong, and nobody's trying to keep me scrolling for another forty minutes. That lack of persuasion allows me to explore unknown artists (to me) and not be restricted by the hive-mind think tank of what "sounds good".</p>
<p>I wanted discovery without being influenced or restricted by algorithms.</p>
</section>

<section>
<p>With the help of ChatGPT I was able to generate a SPARQL query to find artists. Small note: ChatGPT got many of the wd:P??? and wdt:Q???? values wrong. They are worth double checking and discovering new ones via wikidata directly.</p>



```sparql
PREFIX wd:  <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX wikibase: <http://wikiba.se/ontology#>

SELECT DISTINCT
  ?band
  ?bandLabel
  ?originLabel
  (GROUP_CONCAT(DISTINCT ?genreLabel; separator=", ") AS ?genres)
WHERE {
  ?band wdt:P31 wd:Q215380 ;          # instance of: musical group
        wdt:P495 wd:Q30 ;             # country of origin: United States
        wdt:P136 ?genre .             # genre

  VALUES ?genre {
    wd:Q617240       # stoner rock
    wd:Q11366        # alternative rock
    wd:Q720959       # sludge metal
    wd:Q38848        # heavy metal
  }

  OPTIONAL {
    ?band wdt:P136 ?allGenre .
    ?allGenre rdfs:label ?genreLabel .
    FILTER(LANG(?genreLabel) = "en")
  }

  OPTIONAL {
    ?band wdt:P495 ?origin .
    ?origin rdfs:label ?originLabel .
    FILTER(LANG(?originLabel) = "en")
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
  }
}
GROUP BY ?band ?bandLabel ?originLabel
ORDER BY ?bandLabel

```
</section>

<section>
<p>Results:</p>
<img src="/images/american_rock.png" alt="Wikidata SPARQL query results showing a list of bands with their genres and origins." />
</section>

<section>
<p>Thounds of artists waiting to be heard, no proprietary recommendation engine required.</p>
<p>Party on Wayne, party on Garth! 🤘</p>
</section>
