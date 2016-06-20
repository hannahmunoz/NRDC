angular.module('app.controllers', ['ionic', 'app.services', 'angularUUID2', 'ngFileUpload'])

//the controller for the people view  
.controller('peopleCtrl', function($scope, $rootScope, uuid2, Upload, logger, $ionicPlatform, Camera) {

	// variables stored in people
	$scope.people = {};
	$scope.imageData;

	//JSON fucntion for people
	$scope.savePeopleJSON = function (){
			peopleJSON = {};
			peopleJSON ["Creation Date"] = new Date();
			peopleJSON ["Modification Date"] = new Date();
			peopleJSON ["Unique Identifier"] = uuid2.newuuid();

			peopleJSON ["First Name"] = $scope.people.firstName;
			peopleJSON ["Last Name"] = $scope.people.lastName;
			peopleJSON ["Organization"] = $scope.people.organization;
			peopleJSON ["Email"] = $scope.people.email;
			peopleJSON ["Phone"] = $scope.people.phone;

			peopleJSON ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify(peopleJSON))
	}

	//wrapper for the image convert factory so we can call it from the photo button
	$scope.converts = function (file){
		$scope.imageData = Camera.convertToBase64 (file);
	}


	$scope.choosePicture = function (){
		Camera.checkPermissions();
		Camera.openGallery ();
	}

	//wrapper for the take image factory so we can call it from the takePhoto button
	$scope.takePicture = function (){
		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
    		Camera.checkPermissions();
    		Camera.openCamera ();
		}

	}
	// resets the forms. Currently only empties the people varaible. Needs to be edited to set all forms pristine
	$scope.resetForm = function (){
		$scope.people = {};
	}

})
   
.controller('viewPeopleCtrl', function($scope, select) {
	//$scope.personJSON = {};

	$scope.personJSON = select.get();
	console.log ($scope.personJSON);

})
   
.controller('projectCtrl', function($scope, uuid2, logger) {
	//variables stored in projects
	$scope.project = {};

	// JSON function for project
	$scope.saveProjectJSON = function (){
console.log ($rootScope.syncedJSON);
		projectJSON = {};

		projectJSON ["Creation Date"] = new Date();
		projectJSON ["Started Date"] = new Date();
		projectJSON ["Modification Date"] = new Date();
		projectJSON ["Unique Identifier"] = uuid2.newuuid();

		projectJSON ["Name"] = $scope.project.name;
		projectJSON ["Institution Name"] = $scope.project.institution;
		projectJSON ["Original Funding Agency"] = $scope.project.funding;
		projectJSON ["Grant Number"] = $scope.project.grantNumber;

		// print json to console for debugging
		logger.log (JSON.stringify(projectJSON))
	}

	// resets the forms. Currently only empties the people varaible. Needs to be edited to set all forms pristine
	$scope.resetForm = function (){
		$scope.project = {};
	}

})
   
.controller('viewProjectCtrl', function($scope) {

})
   
.controller('siteCtrl', function($scope) {

})
   
.controller('viewSiteCtrl', function($scope) {

})
   
.controller('systemCtrl', function($scope) {

})
   
.controller('viewSystemCtrl', function($scope) {

})
   
.controller('deploymentCtrl', function($scope) {

})
   
.controller('viewDeploymentCtrl', function($scope) {

})
   
.controller('componentCtrl', function($scope) {

})
   
.controller('viewComponentCtrl', function($scope) {

})
   
.controller('documentCtrl', function($scope) {

})
   
.controller('viewDocumentCtrl', function($scope) {

})
   
.controller('serviceEntryCtrl', function($scope) {

})
   
.controller('viewServiceEntryCtrl', function($scope) {

})
   
.controller('mainMenuCtrl', function($scope, $rootScope, $q, $window, sync, $http, logger) {

	// create global variables
	$rootScope.peopleSyncedJSON = {};

	$rootScope.baseURL = "http://sensor.nevada.edu/GS/Services/";
	$rootScope.urlPaths = ["people","projects", "sites", "systems", "deployments", "components", "documents","service_entries"];


    $scope.randomTimingOffset = [];
    
    $scope.setRndTimingOffsets = function(){
    	

        numTiles = $window.document.getElementsByClassName("tile-btn").length;
        
        for( tile = 0; tile < numTiles; tile++ ){
            $scope.randomTimingOffset[tile] = {};
            $scope.randomTimingOffset[tile]["-webkit-animation-delay"] = Math.random() + 's';
            $scope.randomTimingOffset[tile]["animation-delay"] = $scope.randomTimingOffset[tile]["-webkit-animation-delay"];
        }
    }

    $scope.uploadJSONS = function(){
    	
    }

// only runs the first time the program is called. 
// Reads from the server and inputs into array
// TODO: add to local phone storage and read from there if server is unavaible
    var init = function (){
    		var promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[0]+"/");
    			promise.then (function(result){
    				$rootScope.peopleSyncedJSON = result;	
    	}),function (error){

    			}
}
    init ();
})

/**
    Controller handles scroll functionality,
    binds to arrow objects,
    hides arrow objects
*/
.controller('scrollController', function($scope, $ionicScrollDelegate, logger) {
    $scope.isBottom = false;
    smoothnessOffset = 10;  //enrures 
    
    //scrolls the content window to the bottom
    $scope.scrlBot = function(){
        $ionicScrollDelegate.$getByHandle('scrollable').scrollBottom(true);
    }
    
    //hide arrow when user scrolls nearly to bottom
    //hides using angular logic
    //updates bool evaluated by ng-hide
    $scope.cndHideArrow = function(){
        $scope.isBottom = ($ionicScrollDelegate.getScrollPosition().top >= 
                            $ionicScrollDelegate.getScrollView().__maxScrollTop - smoothnessOffset)
        $scope.$apply();
    }
})

.controller('peopleListCtrl', function($scope, $rootScope, select) {
	// wrapper for person select button
	$scope.select = function(JSON){
		select.set (JSON);
	}
})

