'use strict';

//angular.module('dashboardJsApp').service('PrintTemplateService', ['tasks', 'PrintTemplateProcessor', '$q', '$templateRequest', '$lunaService', function(tasks, PrintTemplateProcessor, $q, $templateRequest, lunaService) {
angular.module('dashboardJsApp').service('PrintTemplateService', ['tasks', 'FieldMotionService', 'PrintTemplateProcessor', '$q', '$templateRequest', function(tasks, FieldMotionService, PrintTemplateProcessor, $q, $templateRequest) {
  // TODO: move code from PrintTemplateProcessor here
  // helper function to get path to a print template based on it's ID
  function findPrintTemplate (form, sCustomFieldID) {
    var s = ((sCustomFieldID!==null && sCustomFieldID !== undefined && sCustomFieldID!=='-') ? sCustomFieldID : 'sBody');
    var printTemplateResult = form.filter(function (item) {
      return item.id === s;
    });
    var retval = printTemplateResult.length !== 0 ? printTemplateResult[0].name.replace(/\[pattern(.+)\].*/, '$1') : "";
    return retval;
  };
  // object for caching loaded templates
  var loadedTemplates = {};
  var service = {
    // method to get list of available print templates based on task form.
    getTemplates: function(form) {
      if (!form) {
        return [];
      }

      var templates = [];
      var topItems = [];

      var markerExists = false;

      for(var i = 0; i < form.length; i++) {
        if (form[i].id && form[i].id.includes('marker') && form[i].value.includes('ShowFieldsOn')){
          markerExists = true;
          break;
        }
      }

      try {

        for(var i = 0; i < form.length; i++) {

           if( form[i].type === 'table' && form[i].aRow && typeof form[i].aRow[0] !== 'number') {

              console.log(  " #1438 " + form[i].id + " loaded");

			    	  var prints = FieldMotionService.getPrintForms(); // form[i].id
			    	  console.log( " #1438 PrintForms count " + prints.length );

              var label = '';
             
			    	  for (var j = 0; j < prints.length; j++) {
			    		  //console.log( " #1438 prints=" + prints[j].sName + " containsId=" + FieldMotionService.FieldMentioned.inPrintForm( form[i].id ) );

                angular.forEach( form[i].aRow, function( item, key, obj ) { 
                  var indexTitleField = item.aField.indexOf( prints[j].sTitleField ); 
                  
                  if( indexTitleField > -1 ) { 
                    label = item.aField[indexTitleField].sValue; 
                    console.log( " #1438 sTitleField found '" + form[i].id + "'=" + label ); 
                  } else { 
                    label = item.aField[0].sValue; 
                    console.log( " #1438 '" + form[i].id + "'=" + label ); 
                  } 
                } ); 

                /*
			    		  if( prints[j].sTitleField ) {

                  // search sTitleField column inputs
			    			  //selector = selector + ' [name^="' + prints[j].sTitleField + '"]';

                  var item = {

                    id: form[i].id,
                    displayTemplate: prints[j].sName,
                    type: "markers",
                    value: "{ tableId: form[i].id, printFormId: prints[j] }",

                  };

                  topItems.unshift( item );

			    		  }
                else {
                */ 

                  // just PrintForm sName 
                  var item = {

                    id: form[i].id,
                    displayTemplate: prints[j].sName + ' (' + label + ')',
                    type: "markers",
                    value: "{ tableId: form[i].id, printFormId: prints[j] }",

                  };

                  topItems.unshift( item );

                //} 

                console.log( "Top item added " + prints[j].sName + " count:" + topItems.length);

            } 
          }
        }

      }
      catch(e) {
        console.log( "Mistake " + e );
      }

      if (markerExists){
          templates = form.filter(function (item) {
          var result = false;
          if (item.id && item.id.includes('sBody')
            && (!FieldMotionService.FieldMentioned.inShow(item.id)
            || (FieldMotionService.FieldMentioned.inShow(item.id)
            && FieldMotionService.isFieldVisible(item.id, form)))) {
            result = true;
            // На дашборде при вытягивани для формы печати пути к патерну, из значения поля -
            // брать название для каждого элемента комбобокса #792
            // https://github.com/e-government-ua/i/issues/792
            if (item.value && item.value.trim().length > 0 && item.value.length <= 100){
              item.displayTemplate = item.value;
            } else {
              item.displayTemplate = item.name;
            }
          }
          return result;
        });
      } else {
          templates = form.filter(function (item) {
          var result = false;
          if (item.id && item.id.indexOf('sBody') >= 0) {
            result = true;
            // На дашборде при вытягивани для формы печати пути к патерну, из значения поля -
            // брать название для каждого элемента комбобокса #792
            // https://github.com/e-government-ua/i/issues/792
            if (item.value && item.value.trim().length > 0 && item.value.length <= 100){
              item.displayTemplate = item.value;
            } else {
              item.displayTemplate = item.name;
            }
          }
          return result;
        });
      }

      if(topItems.length > 0) {
        angular.forEach( topItems, function( item ) { templates.unshift(item); } );
      }

      templates.unshift({ id: "Id1438", displayTemplate: "Testing", type: "markers", value: "Test 1438" });

      return templates;
    },
    // method to get parsed template
    getPrintTemplate: function(task, form, printTemplateName) {
      var deferred = $q.defer();
      if (!printTemplateName) {
        deferred.reject('Неможливо завантажити форму: немає назви');
        return deferred.promise;
      }
      // normal flow: load raw template and then process it
      var parsedForm;
      if (!angular.isDefined(loadedTemplates[printTemplatePath])) {
        var printTemplatePath = findPrintTemplate(form, printTemplateName);
        tasks.getPatternFile(printTemplatePath).then(function(originalTemplate){
          // cache template
          loadedTemplates[printTemplatePath] = originalTemplate;
          parsedForm = PrintTemplateProcessor.getPrintTemplate(task, form, originalTemplate);
          deferred.resolve(parsedForm);
        }, function() {
          deferred.reject('Помилка завантаження форми');
        });
      } else {
        // resolve deferred in case the form was cached
        parsedForm = PrintTemplateProcessor.getPrintTemplate(task, form, loadedTemplates[printTemplatePath]);
        deferred.resolve(parsedForm);
      }
      // return promise
      return deferred.promise;
    }
  };
  return service;
}]);
