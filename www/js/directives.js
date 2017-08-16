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
            form: '='
        },
        templateUrl: 'templates/directive_templates/image-button.html',
        replace: true,
        link: link
    }



    function link(scope, element, attr){
        //on click
        //call the function bound to funct
        element.on('click', function(e){
            //performs the function bound
            //from the view via funct
            // funct should be either camera or gallery retrival
            scope.funct()
            .then(function(image){
                //indicate form modification
                scope.form.modified = true
                scope.image = image;

                clearSiblingCSS(element);
                element.css({
                  'background-image': 'url(data:image/jpeg;base64,' + image + ')',
                  'background-position': 'center',
                  'background-size': '300px 300px',
                });
            });
        });

        /**
         * Clears any remaining image from image button
         * @param  {object} e Root DOM element of image button directive
         * @return {[type]}   [description]
         */
        function clearSiblingCSS(e){
            e.parent().children().css({
                'background-image' : ''
            });
        }
    }
})


.directive('imageFabCluster', ['Utility', 'File', 'LazyLoad', '$ionicLoading', '$q', function(Utility, File, LazyLoad, $ionicLoading, $q){
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
    function ImageFabClusterController($scope, $rootScope, $ionicModal, $ionicLoading){
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
        $scope.fetchFromServer = fetchFromServer;
        $scope.verifyDelete = verifyDelete;



        /* Delete and Save Image Calls
        =====================================*/
        function viewImage(){
              openModal('templates/modal_templates/Full_Image_Modal.html');
        };

        function deleteLocal(){
            //open warning modal
            //functionality of actual deletion called from
            openModal('templates/modal_templates/delete_image_verification_modal.html');
        }

        function saveLocal(){
            File.SaveImageToFile($scope.context, $scope.id, $scope.image);
            LazyLoad.setLocalSaveState($scope.id, true);
            $scope.saved = true;
        }

        function deleteFromDB(){
            $scope.image = null;

            //indicate form modification for save
            $scope.form.modified = true
        }

        function fetchFromServer(){
            //variables
            var imageRequest = {};

            imageRequest[$scope.context] = $scope.id;

            LazyLoad.forceDownloadImage(imageRequest)
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
                },
                function failure(error){
                    $ionicLoading.hide();
                    console.warn("Failure to retrieve image: ", error);
                }
            );
        }

        /**
         * Performs delete functionality from modal.
         * THis function is called on click from
         * delete_image_verification_modal.html
         * @return {none} [description]
         */
        function verifyDelete(){
            //perform delete functionality
            File.DeleteImageFromFile($scope.context, $scope.id);
            LazyLoad.setLocalSaveState($scope.id, false);
            $scope.saved = false;
            $scope.image = null;

            closeModal();
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
         function openModal(template) {
            return $q(function (resolve, reject){
                $rootScope.modalHidden = false;

                // If a modal is not
                // already instantiated in this scope
                if($scope.modal == null){
                    $ionicModal.fromTemplateUrl(template,
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
            });
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
            $scope.saved = LazyLoad.getBooleanLocalSaveState();
        };



    };
}])

.directive('imageDisplay', ['Utility', 'LazyLoad', function(Utility, LazyLoad){

    return{
        restrict: 'E',
        scope: { image: '=',
                 id: '=',
                 context: '@',
                 form: '='},
        templateUrl: 'templates/directive_templates/image-display.html',
        replace: true,
        controller: lazyLoadImageController,
        link: link
    };


    /**
     * Links controller logic to view. Updates view according to local changes
     * to image in scope
     * @param  {object} scope   The current scope of the directive (is only three elements presently)
     * @param  {object} element The DOM element of the directive for view manip.
     * @param  {object} attrs   The attributes on the dom object (not used)
     * @param  {object} ctrl    A refrence to the local controller.
     * @return {null}         [description]
     */
    function link(scope, element, attrs, ctrl){
        //ambient watching
        scope.$watch('image', bindElement, true);


        /*** Function Defintions ***/

        //display the image retrieved from the database
        // or device
        function bindElement(){
            if(scope.image === null || scope.image === ""){
                clearElement(element);
            }
            else {
                updateThumbnail(element);
            }
        }

        /**
         * Removes an image from the thumbnail and adds message
         * @param  {object} element Refrence to DOM object containing the root element
         * @return {null}         [description]
         */
        function clearElement(element){
            //only add information text if it does not already exist
            // double calls happen when image updates with data from
            // server
            if(typeof(element.children()[1]) === 'undefined'){
                element.css({
                  'background-image':'none',
                  'background-color':'steelblue'
                });
                element.append("<h1 class='msg' style='color:rgba(255,255,255,.6); padding-top:20%; padding-left:10%;'> No Image Saved To <br/> Device or Database </h1>");
            }
        }


        /**
         * Updates the thumbnail in response to changes in the image in the local
         * scope of our controller
         * @param  {object} element Refrence to the root DOM object of the
         * @return {null}         [description]
         */
        function updateThumbnail(element){
            var dispImage;

            //convert image into base64
            dispImage = Utility.baseSwap_16_to_64(scope.image);

            //update view with image data
            element.css({
              'background-image': 'url(data:image/jpeg;base64,' + dispImage + ')',
              'background-position': 'center',
              'background-size': element[0].offsetWidth  + 'px ' + element[0].offsetHeight + 'px'
            });
            //delete information text (if it exists)
            if(typeof(element.children()[1]) !== 'undefined'){
              element.children()[1].remove();
            }
        }

    }

    function lazyLoadImageController($scope, $ionicLoading, File){

        //Executable Code
        onLoad();

        /*** Function Definitions ***/

        /**
         * Runs on load of image-display directive.
         * Retrieves an image associated with an item from the scope
         * and updates the scope for display.
         * @return {Null} [description]
         */
        function onLoad(){

            //variables
            var imageRequest = {};

            //only do this if there is nothing in session memory
            if( true ){               // can be a returned null
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
                        if(response.fromFile == true && response.image != null){
                            $scope.saved = true;
                        }
                    },
                    function failure(error){
                        $ionicLoading.hide();
                        $scope.saved = false;
                        console.warn("Failure to retrieve image: ", error);
                    }
                );
            }
            //draw from the session image, because it exists
            else {
                $scope.image = LazyLoad.getSessionImage($scope.id);
            }
        }
    }
}])

.directive('conflictChecker', ['sync', 'File', function(sync, File){
    return {
        restrict: 'A',
        controller: conflictCheckerController,
        link: link
    }

    function link(){

    }

    //this controller will handle the routing of
    // all returned, conflicted json
    function conflictCheckerController($scope, $rootScope, $state){


        //binding functions to
        $scope.check = check;

        function check(modified){
            sync.conflictCheck($rootScope.baseURL + 'Verify/', modified, true)
            .then(
                function success(response){
                    //if response indicates that all is well
                    // then set scope variable
                    // that hides conflictChecker and unhides sync options
                    if(countConflicts()){
                        console.log("No Conflicts We Good!");
                    }
                    else{

                        // resolve conflicts by changing states and resolving the conflicts
                        $state.go( 'conflict', {response: response, modified: modified} );

                        //regesiter fucntionality that picks up data from the confilct resolution module\
                        $rootScope.$on('$stateChangeSuccess',
                        function(event, toState, toParams, fromState, fromParams, options){
                            //fromState in the state the router is coming fromState
                            // toParams are the params coming to the destination state
                            if(fromState.name == 'conflict' && angular.isDefined(toParams.resolved)){
                                if (File.checkFile ('Edit')){
                                    File.checkandWriteFile('Edit', toParams.resolved);
                                }
                                $rootScope.editJSON = toParams.resolved;

                                console.log($rootScope.editJSON);
                            }
                        })
                    }
                },
                function failure(error){

                }
            );
        }

        function countConflicts(response){
            var count = 0;
            for(category in response){
                    count += response[category].length;
            }
            return count;
        }

        /**
         * This function is used to copy the returned conflict resolved
         * JSON into the rootScope.editJSON container
         * I have to do this becuase of an odd problem where the assignment is appending
         * values instead of overwriting
         * @return {object} [description]
         */
        function shallowCopy(){

        }


    }

}])

.directive('comparisonPopulator', [function(){
    return{
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directive_templates/general-comparison-form.html',
        controller: populatorController
    };



    function populatorController($scope, $rootScope, $state, $stateParams, $q){
        //controller scope variables
        var categories = [];
        var category = "";
        var conflicts = [];
        var localValues = [];


        //IIFE: performs the setup of the controller
        setupScope();
        $rootScope.$on('$stateChangeSuccess', resetScope);

        //bind functions to the scope
        $scope.populateNextConflict = populateNextConflict;
        $scope.saveAndReturn = saveAndReturn;



        /**
         * THis function only sets up the view and calls a
         * function which saves user slections to modified
         * @return {null} [description]
         */
        function populateNextConflict(){


            saveUserSelections($scope.category, $scope.resolutionItem);

            //scan over the list of potential conflicts by category
            // skipping those with no conflicts and breaking when
            // we have iterated over all categories
            // set values for list population when we get a match
            while(conflicts.length === 0 && categories.length > 0){
                category = categories.shift();
                conflicts = angular.copy($stateParams.response[category]);
                localValues = angular.copy($stateParams.modified[category]);
            }
            //if there are potential conflicts to be resolved in a category
            if(conflicts.length > 0){
                //set the category for the scope
                $scope.category = category;
                $scope.conflictButtonText = "Save Choices and Continue";

                //reregister next button functionality
                //and populate item view of first item
                $scope.resolutionItem = populateItemView(conflicts, localValues);
            }
            //we are at the end of the categories and need to clean up and
            //end everything
            else {
                clearWorkingScope();
                $scope.category = "All Issues Resolved! Press the save and continue button to save your choices. Or use your hardware back button to discard changes.";
                $scope.finished = true;
            }
        }


        /**
         * Populates the specific details of a item in need of conflicts
         * resolution. Performs no resolution logic.
         * @param  {array} conflicts   An array of all conflicted items from the server associated with a particular category
         * @param  {array} localValues An array of all items staged for upload on the local device associated with a particular category
         * @return {object}            A refrence to the particular local item associated with our current view (to be used as the base storage
         *                               of the resolved properties of each item)
         */
        function populateItemView(conflicts, localValues){

            var conflictItem = conflicts.shift();
            var localItem = localValues.shift();
            $scope.name = localItem['Name'];
            $scope.conflictRenderer = {};

            //set up conflict renderer with
            //the information for both items
            for(property in conflictItem){
                if(property == "Location"){ //location edge case
                    //do nothing rn will parse later
                }
                else if(localItem[property] != conflictItem[property] &&
                    property != "Modification Date" &&
                    property != "Established Date"){
                        $scope.conflictRenderer[property] = { local: localItem[property], conflict: conflictItem[property] };
                }

            }

            return localItem;
        }


        /**
         * Save the user selections to a master list of resolved items and
         * non-conflicted items staged for upload
         * @param  {string} category       The current working category of the item being saved
         * @param  {object} resolutionItem The object being saved in the master list of resolved items
         * @return {null}                  [description]
         */
        function saveUserSelections(category, resolutionItem){

            if(category != ""){
                //update the modification date of the resolution item
                resolutionItem["Modification Date"] = new Date();

                //find the location of the resolution item in
                //our resolved item store and save it there
                for( item in $scope.resolved[category]){
                    if($scope.resolved[category][item]["Unique Identifier"] === resolutionItem["Unique Identifier"]){
                        $scope.resolved[category][item] = resolutionItem;
                    }
                }
            }
        }

        /**
         * Return to the main menu carrying the user slections of
         * resolution.
         * @return {[type]} [description]
         */
        function saveAndReturn(){
            //variables
            var resolvedSelections = {resolved: $scope.resolved};

            //change state with argument of scope.resolved
            $state.go('mainMenu', resolvedSelections);
        }


        /**
         * Acts as sort of a destructor: clears all context sensitive info for last page
         * of conflict resolution module. Abstracted out from poulate next conflict
         * @return {null}
         */
        function clearWorkingScope(){
            $scope.conflictRenderer = {};
            $scope.name = null;
        }

        /**
         * Counts all the conflicts in need of resolution
         * @return {null} [description]
         */
        function countConflicts(){
            var count = 0;

            for(category in $stateParams.response){
                    count += $stateParams.response[category].length;
            }

            return count;
        }

        function setupScope(){
            categories = Object.keys($stateParams.response);
            $scope.resolved = angular.copy($stateParams.modified);
            $scope.resolutionItem = {};
            $scope.conflictButtonText = "Resolve Conflicts";
            $scope.category = "There are " + countConflicts() + " conflict(s) in need of resolution, before sync is allowed.";
            $scope.finished = false;
        }

        function resetScope(event, toState, toParams, fromState, fromParams, options){
            if(toState.name == 'conflict' && fromState.name == 'mainMenu'){
                categories = Object.keys($stateParams.response);
                $scope.resolved = angular.copy($stateParams.modified);
                $scope.resolutionItem = {};
                $scope.conflictButtonText = "Resolve Conflicts";
                $scope.category = "There are " + countConflicts() + " conflict(s) in need of resolution, before sync is allowed.";
                $scope.finished = false;
            }
        }


    }
}])
