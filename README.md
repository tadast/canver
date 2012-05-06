## Canver

Canver is a paint application. It was developed for iPads, but should work (more or less) on any touchscreen device.
You can [try it live here.](http://tadast.github.com/canver)

It is just a simple client-side application based on HTML5 canvas, written purely in HTML, CoffeeScript and CSS.

## Home Screen

For iOS devices, it is recommended to add Canver to Home Screen: then it feels more like a native app and works on full-screen.

### Development

```
    > git clone git@github.com:tadast/canver.git
    > cd canver
    > ./watch # a helper script to compile all the coffee on the fly
```

### Tests

You'll need ruby and Bundler to run the tests. First, run `bundle install`. Once it's finished, run `bundle exec rake jasmine` and open the url provided by jasmine to run the tests. If you add any new files, make sure they are captured by the configuration file in `spec/javascripts/support/jasmine.yml` and `watch` file.

### Known Issues

* Does not support device orientation change.
* Does not support image saving when added to Home Screen.
* View is broken on smaller screens e.g. iPhone.

### Features

![Canver's features](http://i.imgur.com/Mk09C.png)

http://i.imgur.com/SsSlK.png
http://i.imgur.com/1ziuR.png
http://i.imgur.com/kpdRw.jpg