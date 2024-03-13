---
layout: archive
title: "Portfolio"
permalink: /portfolio/
author_profile: true
---

Sample document listing for the collection `_portfolio`.

<div class="grid__wrapper">
  {% for post in site.portfolio %}
    {% include archive-single.html type="grid" %}
  {% endfor %}
</div>