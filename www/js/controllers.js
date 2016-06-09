angular.module('app.controllers', ['app.services', 'angularUUID2' ])

//the controller for the people view  
.controller('peopleCtrl',['$scope', function($scope) {

	// variables stored in people
	$scope.people = {};

	//logging function, to check that the values are being filled correctly
	$scope.savePeopleJSON = function (){
			peopleJSON = {}
			peopleJSON ["Creation Date"] = new Date();
			peopleJSON ["Modification Date"] = new Date();
			peopleJSON ["Unique Identifier"] = uuid2.newuuid();

			peopleJSON ["First Name"] = $scope.people.firstName;
			peopleJSON ["Last Name"] = $scope.people.lastName;
			peopleJSON ["Organization"] = $scope.people.organization;
			peopleJSON ["Email"] = $scope.people.email;
			peopleJSON ["Phone"] = $scope.people.phone;

			peopleJSON ["Photo"] = $scope.photo;


		if (typeof console == "undefined") {
    		window.console = {
       		 log: function () {}
   			 };
		}

		console.log( JSON.stringify(peopleJSON));
	}

	$scope.uploadFile = function(files) {
    var photo = new FormData();
    //Take the first selected file
    photo.append("file", files[0]);
    console.log( photo);
	}

	// resets the forms. Currently only empties the people varaible. Needs to be edited to set all forms pristine
	$scope.resetForm = function (){
		$scope.people = {}; 
	}

}])
   
.controller('viewPeopleCtrl', function($scope) {

})
   
.controller('projectCtrl', function($scope) {

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
   
.controller('mainMenuCtrl', function($scope, $ionicSideMenuDelegate) {

})

