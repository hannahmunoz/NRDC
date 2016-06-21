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
	$scope.personJSON = select.get();
	console.log ($scope.personJSON);
})
   
.controller('projectCtrl', function($scope, $rootScope, uuid2, logger) {
	//variables stored in projects
	$scope.project = {};
	$scope.selected = $rootScope.peopleSyncedJSON;
	// TODO: figure out selected spinnger

	// JSON function for project
	$scope.saveProjectJSON = function (){
		projectJSON = {};

		projectJSON ["Creation Date"] = new Date();
		projectJSON ["Started Date"] = new Date();
		projectJSON ["Modification Date"] = new Date();
		projectJSON ["Unique Identifier"] = uuid2.newuuid();

		projectJSON ["Name"] = $scope.project.name;
		projectJSON ["Institution Name"] = $scope.project.institution;
		projectJSON ["Original Funding Agency"] = $scope.project.funding;
		// needs to be a string
		projectJSON ["Grant Number"] = $scope.project.grantNumber.toString();

		// print json to console for debugging
		logger.log (JSON.stringify(projectJSON))
	}

	// resets the forms. Currently only empties the people varaible. Needs to be edited to set all forms pristine
	$scope.resetForm = function (){
		$scope.project = {};
	}

})
   
.controller('viewProjectCtrl', function($scope, select) {
	$scope.projectJSON = select.get();
	console.log ($scope.projectJSON);

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
	$rootScope.projectSyncedJSON = {};
	$rootScope.siteSyncedJSON = {};
	$rootScope.systemSyncedJSON = {};
	$rootScope.deploymentSyncedJSON = {};
	$rootScope.componentSyncedJSON = {};
	$rootScope.documentSyncedJSON = {};
	$rootScope.serviceSyncedJSON = {};

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
    	// people read
    	var promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[0]+"/");
    		promise.then (function(result){
    			$rootScope.peopleSyncedJSON = result;	
    		}),function (error){

    		}

    	//project read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[1]+"/");
    		promise.then (function(result){
    			$rootScope.projectSyncedJSON = result;	
    		}),function (error){

    		}

    	//site read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[2]+"/");
    		promise.then (function(result){
    			$rootScope.siteSyncedJSON = result;	
    		}),function (error){

    		}

    	//project read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[3]+"/");
    		promise.then (function(result){
    			$rootScope.systemSyncedJSON = result;	
    		}),function (error){

    		}

    	//deployment read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[4]+"/");
    		promise.then (function(result){
    			$rootScope.deploymentSyncedJSON = result;	
    		}),function (error){

    		}

    	//component read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[5]+"/");
    		promise.then (function(result){
    			$rootScope.componentSyncedJSON = result;	
    		}),function (error){

    		}

    	//document read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[6]+"/");
    		promise.then (function(result){
    			$rootScope.documentSyncedJSON = result;	
    		}),function (error){

    		}

    	//service Entries read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[7]+"/");
    		promise.then (function(result){
    			$rootScope.serviceSyncedJSON = result;	
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

.controller('listCtrl', function($scope, $rootScope, select) {
	// wrapper for person select button
	$scope.select = function(JSON){
		select.set (JSON);
	}
})

