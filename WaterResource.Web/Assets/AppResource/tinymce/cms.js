//var app=angular.module('myApp');
app.controller('myCntrl', function($sce) {
    var ctrl = this;
	
    this.updateHtml = function() {
      ctrl.tinymceHtml = $sce.trustAsHtml(ctrl.tinymce);
    };
	
	
  });