
#import moduleB
  #import moduleB moduleB
#import moduleB moduleB moduleB

#import io/moduleX
  
#import moduleC
#import io/moduleY

if (window['moduleC$count'] === undefined)
    window['moduleC$count'] = 0;
window['moduleC$count'] = window['moduleC$count'] +1;
