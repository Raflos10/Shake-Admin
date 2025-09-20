require 'dotenv'

Dotenv.load

Jekyll::Hooks.register :site, :after_init do |site|
  site.config['supabase_url'] = ENV['SUPABASE_URL'] || ''
  site.config['supabase_anon_key'] = ENV['SUPABASE_ANON_KEY'] || ''
end
