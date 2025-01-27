require 'prismic'
require 'dotenv'

Dotenv.load

module Jekyll
  class PrismicGenerator < Generator
    safe true

    def generate(site)
      url = 'https://pikaybh-github-io.prismic.io/api/v1/'
      token = ENV['PRISMIC_SECRET']

      if token.nil? || token.empty?
        puts "Error: Prismic API token is missing. Make sure it's set as an environment variable."
        return
      end

      api = Prismic.api(url, token)
      response = api.query(Prismic::Predicates.at('document.type', 'posts'),
        { "orderings" => "[my.posts.date desc]" }
      )
      puts response.results

      unless response.results.any?
        puts "Warning: No documents found in Prismic for 'posts' type."
        return
      end

      response.results.each do |doc|
        post_title = doc['posts.title']&.as_text || 'Untitled'
        post_tags = doc.tags || []
        post_type = doc.type || 'posts'
        post_content = doc['posts.body']&.as_html || 'No content available'
        post_date = doc.first_publication_date || Time.now
        formatted_date = post_date.strftime('%Y-%m-%d')

        # Jekyll의 posts 리소스에 추가
        site.posts.docs << Jekyll::Page.new(site, site.source, '', 'virtual_post.html'), {  # in_source_dir(post_title), {
          site: site,
          collection: site.collections['posts']
        }).tap do |post|
          post.data['title'] = post_title
          post.data['tags'] = post_tags
          post.data['date'] = post_date
          post.data['type'] = post_type
          post.data['layout'] = 'single'
          post.data['author_profile'] = true
          post.data['read_time'] = true
          post.data['comments'] = true
          post.data['share'] = true
          post.data['related'] = true
          post.data['show_date'] = true
          post.data['excerpt'] = post_content
          post.content = post_content
        end

        puts "Added post: #{post_title}"
      end
      
    rescue StandardError => e
      puts "Prismic API fetch error: #{e.message}"
    end
  end
end
