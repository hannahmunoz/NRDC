angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('createNew.people', {
    url: '/CreateNewPeople',
    views: {
      'side-menu21': {
        templateUrl: 'templates/people.html',
        controller: 'peopleCtrl'
      }
    }
  })

  .state('viewPeople', {
    url: '/ViewPeople',
    templateUrl: 'templates/viewPeople.html',
    controller: 'viewPeopleCtrl'
  })

  .state('createNew.project', {
    url: '/CreateNewProject',
    views: {
      'side-menu21': {
        templateUrl: 'templates/project.html',
        controller: 'projectCtrl'
      }
    }
  })

  .state('viewProject', {
    url: '/viewProject',
    templateUrl: 'templates/viewProject.html',
    controller: 'viewProjectCtrl'
  })

  .state('createNew.site', {
    url: '/CreateNewSite',
    views: {
      'side-menu21': {
        templateUrl: 'templates/site.html',
        controller: 'siteCtrl'
      }
    }
  })

  .state('viewSite', {
    url: '/siteView',
    templateUrl: 'templates/viewSite.html',
    controller: 'viewSiteCtrl'
  })

  .state('createNew.system', {
    url: '/CreateNewSystem',
    views: {
      'side-menu21': {
        templateUrl: 'templates/system.html',
        controller: 'systemCtrl'
      }
    }
  })

  .state('viewSystem', {
    url: '/systemView',
    templateUrl: 'templates/viewSystem.html',
    controller: 'viewSystemCtrl'
  })

  .state('createNew.deployment', {
    url: '/CreateNewDeployment',
    views: {
      'side-menu21': {
        templateUrl: 'templates/deployment.html',
        controller: 'deploymentCtrl'
      }
    }
  })

  .state('viewDeployment', {
    url: '/deploymentView',
    templateUrl: 'templates/viewDeployment.html',
    controller: 'viewDeploymentCtrl'
  })

  .state('createNew.component', {
    url: '/CreateNewComponent',
    views: {
      'side-menu21': {
        templateUrl: 'templates/component.html',
        controller: 'componentCtrl'
      }
    }
  })

  .state('viewComponent', {
    url: '/componentView',
    templateUrl: 'templates/viewComponent.html',
    controller: 'viewComponentCtrl'
  })

  .state('createNew.document', {
    url: '/CreateNewDocument',
    views: {
      'side-menu21': {
        templateUrl: 'templates/document.html',
        controller: 'documentCtrl'
      }
    }
  })

  .state('viewDocument', {
    url: '/documetView',
    templateUrl: 'templates/viewDocument.html',
    controller: 'viewDocumentCtrl'
  })

  .state('createNew.serviceEntry', {
    url: '/CreateNewServiceEntry',
    views: {
      'side-menu21': {
        templateUrl: 'templates/serviceEntry.html',
        controller: 'serviceEntryCtrl'
      }
    }
  })

  .state('viewServiceEntry', {
    url: '/serviceEntryView',
    templateUrl: 'templates/viewServiceEntry.html',
    controller: 'viewServiceEntryCtrl'
  })

  .state('createNew.mainMenu', {
    url: '/mainMenu',
    views: {
      'side-menu21': {
        templateUrl: 'templates/mainMenu.html',
        controller: 'mainMenuCtrl'
      }
    }
  })

  .state('peopleList', {
    url: '/peopleList',
    templateUrl: 'templates/peopleList.html',
    controller: 'listCtrl'
  })

  .state('projectList', {
    url: '/projectList',
    templateUrl: 'templates/projectList.html',
    controller: 'listCtrl'
  })

    .state('siteList', {
    url: '/siteList',
    templateUrl: 'templates/siteList.html',
    controller: 'listCtrl'
  })

      .state('systemList', {
    url: '/systemList',
    templateUrl: 'templates/systemList.html',
    controller: 'listCtrl'
  })

  .state('deploymentList', {
    url: '/deploymentList',
    templateUrl: 'templates/deploymentList.html',
    controller: 'listCtrl'
  })

  .state('componentList', {
    url: '/componentList',
    templateUrl: 'templates/componentList.html',
    controller: 'listCtrl'
  })

  .state('documentList', {
    url: '/documentList',
    templateUrl: 'templates/documentList.html',
    controller: 'listCtrl'
  })

  .state('serviceList', {
    url: '/serviceList',
    templateUrl: 'templates/serviceList.html',
    controller: 'listCtrl'
  })
  .state('createNew', {
    url: '/CreateNew',
    templateUrl: 'templates/createNew.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/CreateNew/mainMenu')


});