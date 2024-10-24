Gemfile.setup : Gemfile
	bundle install
	touch Gemfile.setup
setup : Gemfile.setup

test : setup
	bundle exec rspec
