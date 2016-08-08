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
            and offsets input label
*/

.directive('textAreaSize', function(){
    
    var link = function(scope, element, attrs){
        var textSize = element[0];                          //hidden div holding text 
                                                            // for height measurement
        var localTxt = element.parent()[0].childNodes[0];   //text area to be modified
        var label = element.parent()[0].childNodes[1];      //input label eg 'name'
        
        
        //on intial load reasize any already populated text fields
        localTxt.onclick = function(){
            //update data in localdiv to be localTxt height
            textSize.innerHTML = localTxt.value + "<br/>";
            localTxt.style.height = textSize.offsetHeight + 'px';
            
            //maintain the offset of the input label so it remains above the text box
            label.style = ' transform: translate3d(0,-' + (textSize.offsetHeight + 25) + 'px, 0) scale(.9); transition: all 0s linear;';
        }
        
        
        localTxt.oninput = function(){
            
            //update data in localdiv to be localTxt height
            textSize.innerHTML = localTxt.value + "<br/>";
            localTxt.style.height = textSize.offsetHeight + 'px';
            
            //maintain the offset of the input label so it remains above the text box
            label.style = ' transform: translate3d(0,-' + (textSize.offsetHeight + 25) + 'px, 0) scale(.9); transition: all 0s linear;';
        }
    };
    
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="text-format-mirror"></div>',
        link:link
    }
})


//directive declaring and controlling
// a floating action button cluster
.directive('fabCluster', function(){
    
    function HideController($scope, $rootScope, $ionicModal){
        
        $scope.active = false;
        
        $scope.toggleActive = function(){
                $scope.active = true;
        };
        
        $scope.toggleInactive = function(){
                $scope.active = false;
                console.log("called");
        };
        
    }

    
    return{
        restrict: 'E',
        templateUrl: 'templates/directive_templates/fabCluster.html',
        controller: HideController
    }
    
})

//Extracted from GitHub
.directive('clickOff', function($parse, $document) {
    var dir = {
        compile: function($element, attr) {
          // Parse the expression to be executed
          // whenever someone clicks _off_ this element.
          var fn = $parse(attr["clickOff"]);
          return function(scope, element, attr) {
            // add a click handler to the element that
            // stops the event propagation.
            element.bind("click", function(event) {
              event.stopPropagation();
            });
            angular.element($document[0].body).bind("click", function(event) {
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
          };
        }
      };
    return dir;
})


.directive('deletable', function(){
    
    function deletableController($scope, $rootScope){
        //determine is my current view in deletable
        $scope.isDeletable = function(){
            for (var category in $rootScope.unsyncedJSON){
                console.log(category);
            }
        }
    }
    
    return{
        restrict: 'A',
        controller: deletableController
    }
});



// .directive('blankDirective', [function(){

// }]);

