## Canver

Canver is a paint application for touch screen devices.

### Supported Browsers

Works on mobile WebKit browsers (tested on iOS and Android).

### Development

run `./watch` to watch CoffeeScript files and their specs and compile them on the fly.

### Tests

You'll need ruby and Bundler to run the tests. First, run `bundle install`. Once it's finished, run `bundle exec rake jasmine` and open the url provided by jasmine to run the tests. If you add any new files, make sure they are captured by the configuration file in `spec/javascripts/support/jasmine.yml` and `watch` file.