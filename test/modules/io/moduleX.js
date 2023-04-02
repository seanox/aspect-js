
#import moduleB
  #import moduleB moduleB
#import moduleB moduleB moduleB

#import io/moduleX
// io/moduleY does not exist.
// With the macro, a non-existent module causes an error, unlike when loading
// composites, where JS modules are optional.
try {#import io/moduleY
} catch (error) {
    _error_collector.push(String(error));
}

if (window['moduleX$count'] === undefined)
    window['moduleX$count'] = 0;
window['moduleX$count'] = window['moduleX$count'] +1;
