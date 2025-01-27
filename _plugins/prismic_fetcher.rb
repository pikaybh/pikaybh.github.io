require 'prismic'

module Jekyll
  class PrismicGenerator < Generator
    safe true

    def generate(site)
      url = 'https://pikaybh-github-io.prismic.io/api/v2'
      token = ENV['PRISMIC_SECRET']

      if token.nil? || token.empty?
        puts "Error: Prismic API token is missing. Make sure it's set as an environment variable."
        return
      end

      api = Prismic.api(url, token)
      response = api.query(Prismic::Predicates.at('document.type', 'posts'))

      unless response.results.any?
        puts "Warning: No documents found in Prismic for 'posts' type."
        return
      end

      response.results.each do |doc|
        if doc['posts'].nil?
          puts "Error: Missing 'posts' field in Prismic response for document ID #{doc.id}"
          next
        end

        site.data['prismic_posts'] ||= []
        site.data['prismic_posts'] << {
          'title' => doc['posts.title']&.as_text || 'Untitled',
          'content' => doc['posts.body']&.as_html || 'No content available',
          'date' => doc.first_publication_date || 'Unknown'
        }
      end
    rescue StandardError => e
      puts "Prismic API fetch error: #{e.message}"
    end
  end
end
