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


//Directive: conditionalView
//Defines a tag as either ion-modal-view
//or ion-view depending on what called it
.directive('conditionalView', function($interpolate){
    return{
        restrict: 'E',
        scope:{
            tagName: '='
        },
        link: function($scope, $element, $attr, ModalService){
            var content = $element.html();
            $element.contents().remove();
            var tag = $interpolate('<ion-modal-view title="Project" id="page10">{{content}}</ion-modal-view>')
                       ({tagName: $scope.tagName, content: content});
            var e = angular.element(tag);
            $element.replaceWith(e);
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
});


// .directive('blankDirective', [function(){

// }]);

