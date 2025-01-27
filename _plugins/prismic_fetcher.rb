require 'prismic'

module Jekyll
    class PrismicGenerator < Generator
        safe true

        def generate(site)
            api_url = 'https://pikaybh-github-io.cdn.prismic.io/api/v2'
            api = Prismic.api(api_url)
            response = api.query(Prismic::Predicates.at('document.type', 'posts'))

            site.data['prismic_posts'] = response.results.map do |doc|
                {
                    'title' => doc['data.title'].as_text,
                    'content' => doc['data.body'].as_html,
                    'date' => doc.first_publication_date
                }
            end
        end
    end
end
