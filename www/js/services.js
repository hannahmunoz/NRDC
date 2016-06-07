angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);


/*Main Menu Facotry Services*/
/*.factory ('mainMenu', function($http){
	return {

		RetrieveAll: function(){
			return $http.get("http://sensor.nevada.edu/GS/Services/edge/").then(function(response){
				return response;
			}
		});
	}
})*/