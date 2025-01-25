---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

<div class="grid__wrapper">
  {% for post in site.projects %}
    {% include archive-single.html layout="half" type="grid" %}
  {% endfor %}
</div>