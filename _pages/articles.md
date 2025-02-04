---
layout: archive
title: "Articles"
permalink: /articles/
author_profile: true
---

<ul class="taxonomy__index">
  {% assign articlesInYear = site.articles | where_exp: "item", "item.hidden != true" | group_by_exp: 'article', 'article.date | date: "%Y"' %}
  {% for year in articlesInYear %}
    <li>
      <a href="#{{ year.name }}">
        <strong>{{ year.name }}</strong> <span class="taxonomy__count">{{ year.items | size }}</span>
      </a>
    </li>
  {% endfor %}
</ul>

{% assign entries_layout = page.entries_layout | default: 'list' %}
{% assign articlesByYear = site.articles | where_exp: "item", "item.hidden != true" | group_by_exp: 'article', 'article.date | date: "%Y"' %}
{% for year in articlesByYear %}
  <section id="{{ year.name }}" class="taxonomy__section">
    <h2 class="archive__subtitle">{{ year.name }}</h2>
    <div class="entries-{{ entries_layout }}">
      {% for article in year.items %}
        {% include archive-single.html type=entries_layout %}
      {% endfor %}
    </div>
    <a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;</a>
  </section>
{% endfor %}