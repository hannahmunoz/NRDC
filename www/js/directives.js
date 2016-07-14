angular.module('app.directives', [])

//http://stackoverflow.com/questions/16207202/required-attribute-not-working-with-file-input-in-angular-js

.directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ngModel){
      //change event is fired when file is selected
      el.bind('change',function(){
        scope.$apply(function(){
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  }
})


//throws a flag when the last element is loaded from an ng-repeat
.directive('repeatDirective', function(){
    return function(element, scope, attrs){
        scope = angular.element(element)[0];
        if (scope.$last){
            scope.$emit('LastElemLoaded');
        }
    };
})

//directive for expandable input

/*Function: Adds a hidden div which checks the expected size of
            our active text-area & resizes text area (sibling-node) appropriately
*/

.directive('textAreaSize', function(){
    var link = function(scope, element, attrs){
        var textSize = element[0];
        var localTxt = element.parent()[0].childNodes[0];
        
        localTxt.oninput = function(){
            //update data in localdiv to be localTxt.da
            textSize.innerHTML = localTxt.value;
            localTxt.style.height = textSize.offsetHeight + 'px';
        }
    };
    
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="text-format-mirror"></div>',
        link:link
    }
});

// .directive('blankDirective', [function(){

// }]);

