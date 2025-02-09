---
layout: archive
title: "Articles"
permalink: /articles/
---

<ul class="taxonomy__index">
    {% assign articlesInYear = site.articles | where_exp: "item", "item.hidden != true" | group_by_exp: 'article', 'article.date |
    date: "%Y"' %}
    {% for year in articlesInYear %}
    <li>
        <a href="#{{ year.name }}">
            <strong>{{ year.name }}</strong> <span class="taxonomy__count">{{ year.items | size }}</span>
        </a>
    </li>
    {% endfor %}
</ul>

{% assign entries_layout = page.entries_layout | default: 'list' %}
{% assign articlesByYear = site.articles | where_exp: "item", "item.hidden != true" | group_by_exp: 'article', 'article.date | date:
"%Y"' %}
{% for year in articlesByYear %}
<section id="{{ year.name }}" class="taxonomy__section">
    <h2 class="archive__subtitle">{{ year.name }}</h2>
    <div class="entries-{{ entries_layout }}">
        {% for article in year.items %}
          {% if article.header.teaser %}
            {% capture teaser %}{{ article.header.teaser }}{% endcapture %}
          {% else %}
            {% assign teaser = site.teaser %}
          {% endif %}

          {% if article.id %}
            {% assign title = article.title | markdownify | remove: "<p>" | remove: "</p>" %}
          {% else %}
            {% assign title = article.title %}
          {% endif %}

          <div class="{{ include.type | default: 'list' }}__item">
            <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
              {% if include.type == "grid" and teaser %}
                <div class="archive__item-teaser">
                  <img src="{{ teaser | relative_url }}" alt="">
                </div>
              {% endif %}
              <h2 class="archive__item-title no_toc" itemprop="headline">
                {% if article.link %}
                  <a href="{{ article.link }}">{{ title }}</a> <a href="{{ article.url | relative_url }}" rel="permalink"><i class="fas fa-link" aria-hidden="true" title="permalink"></i><span class="sr-only">Permalink</span></a>
                {% else %}
                  <a href="{{ article.url | relative_url }}" rel="permalink">{{ title }}</a>
                {% endif %}
              </h2>
              {% include page__meta.html type=include.type %}
              {% if article.excerpt %}<p class="archive__item-excerpt" itemprop="description">{{ article.excerpt | markdownify | strip_html | truncate: 160 }}</p>{% endif %}
            </article>
          </div>
        {% endfor %}
    </div>
    <a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }}
        &uarr;</a>
</section>
{% endfor %}