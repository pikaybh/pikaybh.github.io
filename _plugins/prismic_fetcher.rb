require 'prismic'

module Jekyll
  class PrismicGenerator < Generator
    safe true

    def generate(site)
      api_url = 'https://pikaybh-github-io.prismic.io/api/v2'
      api = Prismic.api(api_url)
      response = api.query(Prismic::Predicates.at('document.type', 'posts'))

      response.results.each do |doc|
        if doc['posts'].nil?
          puts "Error: Missing 'posts' field in Prismic response"
          next
        end

        site.data['prismic_posts'] ||= []
        site.data['prismic_posts'] << {
          'title' => doc['posts.title']&.as_text || 'Untitled',
          'content' => doc['posts.body']&.as_html || 'No content available',
          'date' => doc.first_publication_date || 'Unknown'
        }
      end
    end
  end
end
