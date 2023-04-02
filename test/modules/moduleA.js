  #import moduleB
  #import moduleB moduleB
  #import moduleB moduleB moduleB
  
#import moduleA
// io/moduleY does not exist.
// With the macro, a non-existent module causes an error, unlike when loading
// composites, where JS modules are optional.
try {#import io/moduleY
} catch (error) {
    alert(error);
    _error_collector.push(String(error));
}

if (window['moduleA$count'] === undefined)
    window['moduleA$count'] = 0;
window['moduleA$count'] = window['moduleA$count'] +1;
