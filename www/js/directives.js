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
        scope.$watch(attrs.textAreaSize, function(){

            //update data in localdiv to be localTxt height
            textSize.innerHTML = localTxt.value + "<br/>";
            localTxt.style.height = textSize.offsetHeight + 'px';

            //maintain the offset of the input label so it remains above the text box
            label.style = ' transform: translate3d(0,-' + (textSize.offsetHeight + 25) + 'px, 0) scale(1); transition: all 0s linear;';
        });


        //resize on text input
        localTxt.oninput = function(){

            //update data in localdiv to be localTxt height
            textSize.innerHTML = localTxt.value + "<br/>";
            localTxt.style.height = textSize.offsetHeight + 'px';

            //maintain the offset of the input label so it remains above the text box
            label.style = ' transform: translate3d(0,-' + (textSize.offsetHeight + 25) + 'px, 0) scale(1); transition: all 0s linear;';
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

        initialize();

        function initialize(){
            $scope.active = false;
        }

        $scope.toggleActive = function(){
                $scope.active = true;
        };

        $scope.toggleInactive = function(){
                $scope.active = false;
        };

    }


    return{
        restrict: 'E',
        templateUrl: 'templates/directive_templates/fabCluster.html',
        controller: HideController
    }

})


.directive('imageFabCluster', ['Utility', 'File', function(Utility, File){
    return {
        restrict:'E',
        templateUrl: 'templates/directive_templates/image-fab-cluster.html',
        controller: ImageFabClusterController,
        link: link
    };

    function link(scope, elem, attrs){
    };

    /**
     * Principal controller for funtionality of FAB cluster in images
     * Specifiaclly handles logic and display of FAB (collapse/expand)
     * some modal funtionality for viewing images, and deleteing and saving
     * images.
     * @param       {scope} $scope      Object handling the current scope of our view and logic
     * @param       {rootScope} $rootScope  The global scope of the applications view and logic
     * @param       {ionicModal} $ionicModal Class containig defintions for modal functionality
     * @constructor
     */
    function ImageFabClusterController($scope, $rootScope, $ionicModal){
        //initialize
        initialize();

        //asign functions to scoped variables
        $scope.viewImage = viewImage;
        $scope.toggleActive = toggleActive;
        $scope.toggleInactive = toggleInactive;
        $scope.openModal = openModal;
        $scope.closeModal = closeModal;
        $scope.destroyModal = destroyModal;
        $scope.deleteLocal = deleteLocal;
        $scope.saveLocal = saveLocal;
        $scope.deleteFromDB = deleteFromDB;



        /* Delete and Save Image Calls
        =====================================*/
        function viewImage(){
              openModal();
        };

        function deleteLocal(){
            File.DeleteImageFromFile($scope.context, $scope.id);
            $scope.saved = false;
        }

        function saveLocal(){
            File.SaveImageToFile($scope.context, $scope.id, $scope.image);
            $scope.saved = true;
        }

        function deleteFromDB(){
            $scope.image = null;
        }


        /* List collapsing/expanding functionality
        =====================================*/

        function toggleActive(){
                $scope.active = true;
        };

        function toggleInactive(){
                $scope.active = false;
        };





        /* local modal functionality
        ====================================*/


        /**
         * open a modal for viewing
         * creates a new modal if one has not been instantiated
         * elsewise opens the old modal
         * @return {null}
         */
         function openModal() {

            $rootScope.modalHidden = false;

            // If a modal is not
            // already instantiated in this scope
            if($scope.modal == null){
                $ionicModal.fromTemplateUrl('templates/modal_templates/Full_Image_Modal.html',
                function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                },
                {
                    scope: $scope,
                    animation: 'slide-in-up'
                });

            }
            else {
               $scope.modal.show();
            }
        };


        /**
         * Deletes modal to free up resources. Sets scope modal variable to null.
         * @return {null}
         */
        function closeModal() {
            $rootScope.modalHidden = true;
            $scope.modal.remove().then (function (){
                    $scope.modal = null;
            });
        };

        /**
         * Destroys modal when no longer needed. Mostly same functionality as above.
         * @return {promise} Promise returned by function has no reject yet.
         */
         function destroyModal() {
            return $q(function (resolve, reject){
              $rootScope.modalHidden = true;
              $scope.modal.remove().then (function (){
                    $scope.modal = null;
                    resolve();
              });
            })
        };


        /**
         * Sets both active and saved variables on the scope to false.
         *  Impotant for setting up view upon user open.
         * @return {null}
         */
        function initialize(){
            $scope.active = false;
            //this will likely change
            $scope.saved = false;
        };

    };
}])

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

    function deletableController($scope, $rootScope, SaveNew, $ionicHistory, DynamicPage, ListNavService){

        //initialize the required
        //variables of the controller
        initialize();


        //delete the current view JSON from the list of unsynced items
        $scope.deleteView = function(){
            //variables
            $scope.JSON = DynamicPage.getJSON();
            $scope.title = ListNavService.getParentTitle(DynamicPage.getTitle());
            $ionicHistory.goBack();
            SaveNew.deleteJSON($scope.JSON.Name, $rootScope.unsyncedJSON[$scope.title],
                               $rootScope.chosenJSONlist, $rootScope.listJSON,$scope.title);
            $rootScope.back();
        };

        $scope.deleteDocument = function(){
            //variables
            $scope.JSON = DynamicPage.getJSON();
            $ionicHistory.goBack();
            SaveNew.deleteJSON($scope.JSON.Name, $rootScope.unsyncedJSON[$scope.title],
                               $rootScope.docListJSON, null, $scope.title);
            $ionicHistory.goBack();
        };

        $scope.deleteService = function(){
            //variables
            $scope.JSON = DynamicPage.getJSON();
            $ionicHistory.goBack();
            SaveNew.deleteJSON($scope.JSON.Name, $rootScope.unsyncedJSON["ServiceEntries"],
                               $rootScope.serviceEntryListJSON, null, $scope.title);
            $ionicHistory.goBack();
        };



        $scope.deletePeople = function(){
            SaveNew.deletePeople(($scope.JSON['First Name'] + $scope.JSON['Last Name']),
                                 $rootScope.unsyncedJSON[DynamicPage.getTitle()],
                               $rootScope.chosenJSONlist, $rootScope.listJSON);
            $ionicHistory.goBack();
        };

          //determine if my current view in deletable
        //by checking for membership in unsyncedJSON
        /**
          * Refactoring notes: Made a function to simplify
          * frontend-backend interaction.
          */
        function isDeletable (){

            for(var category in $rootScope.unsyncedJSON){
                for(var unsEntry = 0;
                    unsEntry < $rootScope.unsyncedJSON[category].length;
                    unsEntry++){
                        if($scope.JSON === $rootScope.unsyncedJSON[category][unsEntry]){
                            $scope.deletable = true;
                            $scope.active = false;
                    }
                }

            }
        };

        function initialize(){
            $scope.deletable = false;
            isDeletable();
        }

    };

    return{
        restrict: 'A',
        controller: deletableController
    }


})

//http://stackoverflow.com/questions/30537886/error-ngmodeldatefmt-expected-2015-05-29t190616-693209z-to-be-a-date-a/35014420
.directive('dateInput', function(){
    return {
        restrict : 'A',
        scope : {
            ngModel : '='
        },
        link: function (scope) {
            if (scope.ngModel) scope.ngModel = new Date(scope.ngModel);
        }
    }
})


.directive('imageButton', function(){

    return{
        restrict: 'E',

        scope: {
            funct: '=funct',
            icon: '=icon',
            image: '=image',
            form: '='
        },

        templateUrl: 'templates/directive_templates/image-button.html',

        replace: true,

        link: function(scope, element, attr){
            var clearSiblingCSS = function(e){
                e.parent().children().css({
                    'background-image': ''
                });
            }

            //on click
            //call the function bound to funct
            element.on('click', function(e){

                //performs the function bound
                //from the view via funct
                // funct should be either camera or gallery retrival
                scope.funct()
                .then(function(image){
                    scope.form.modified = true;
                    console.log(scope.form);
                    scope.image = image;
                    clearSiblingCSS(element);
                    element.css({
                      'background-image': 'url(data:image/jpeg;base64,' + image + ')',
                      'background-position': 'center',
                      'background-size': '300px 300px',
                    });
                });
            });
        }
    }
})



.directive('imageDisplay', ['Utility', 'LazyLoad', function(Utility, LazyLoad){

    return{
        restrict: 'E',
        scope: { image: '=', //im not sure if image is needed, we'll see?
                 id: '=',
                 context: '@'},
        templateUrl: 'templates/directive_templates/image-display.html',
        replace: true,
        controller: ['$scope',  '$ionicLoading', 'File',  function lazyLoadImageController($scope, $ionicLoading, File){

            //Executable Code
            onLoad();


            //Function Definitions

            /**
              * Runs on load of image-display directive.
              * Retrieves an image associated with an item
              * and updates the scope for display.
              *
              */
            function onLoad(){
                //variables
                var imageRequest = {};
                $scope.image = LazyLoad.getSessionImage($scope.id);

                //only do this if there is nothing in memory
                if($scope.image == null){

                    //delibrate formatting for http query reqs
                    imageRequest[$scope.context] = $scope.id;

                    //fetch image from hdd or server
                    LazyLoad.fetchImage(imageRequest)
                    .then(
                        $ionicLoading.show({
                            templateUrl: 'templates/directive_templates/loading-spinner.html',
                            noBackdrop: true
                        })
                    )
                    .then(
                        //on sucessful response update scope image for view
                        //save image to session memory
                        //indicate weither image was retrieved from file or not
                        function success(response){
                            $ionicLoading.hide();
                            $scope.image = response.image;

                            //cleanup and flag setting
                            LazyLoad.saveSessionImage($scope.id, response.image);
                            if(response.fromFile == true){
                                $scope.saved = true;
                            }
                        },
                        function failure(error){
                            $ionicLoading.hide();
                            console.warn("Failure to retrieve image: ", error);
                        }
                    );
                }

            }

        }],


        link: function(scope, element, attrs, ctrl){

            //ambient watching
            scope.$watch('image', bindElement, true);

            //display the image retrieved from the database
            function bindElement(){

                if(scope.image != null){

                    LazyLoad.saveSessionImage(scope.id, scope.image);

                    element.css({
                      'background-image': 'url(data:image/jpeg;base64,' + scope.image + ')',
                      'background-position': 'center',
                      'background-size': element[0].offsetWidth  + 'px ' + element[0].offsetHeight + 'px'
                    });
                    if(typeof(element.children()[1]) !== 'undefined'){
                      element.children()[1].remove();
                    }
                } else {
                  element.css({
                    'background-image':'none',
                    'background-color':'steelblue'
                  });
                  element.append("<h1 class='msg' style='color:rgba(255,255,255,.6); padding-top:20%; padding-left:10%;'> No Image Saved To <br/> Device or Database </h1>");
                }
            }

        }
    }

}])
