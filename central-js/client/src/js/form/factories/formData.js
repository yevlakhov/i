define('formData/factory', ['angularAMD',
  'file/directive', 'parameter/factory', 'datepicker/factory',
  'file/factory', 'filebankid/factory', 'bankid/documents/factory',
  'bankid/scans/factory'
], function(angularAMD) {
  angularAMD.factory('FormDataFactory', function(ParameterFactory, DatepickerFactory, FileFactory, FileBankIDFactory, BankIDDocumentsFactory, BankIDScansFactory) {
    var FormDataFactory = function() {
      this.processDefinitionId = null;

      this.fields = {};
      this.params = {};
    };

    FormDataFactory.prototype.initialize = function(ActivitiForm) {
      this.processDefinitionId = ActivitiForm.processDefinitionId;
      for (var key in ActivitiForm.formProperties) {
        var property = ActivitiForm.formProperties[key];
        if ('date' === property.type) {
          this.params[property.id] = new DatepickerFactory();
          this.params[property.id].value = property.value;
        } else if ('file' === property.type) {
          if (/^bankId_scan_/.test(property.id)) {
            this.params[property.id] = new FileBankIDFactory();
            this.params[property.id].value = property.value;
          } else {
            this.params[property.id] = new FileFactory();
            this.params[property.id].value = property.value;
          }
        } else {
          this.params[property.id] = new ParameterFactory();
          this.params[property.id].value = property.value;
        }
      }
    };

    FormDataFactory.prototype.hasParam = function(param) {
      return this.params.hasOwnProperty(param);
    };

    FormDataFactory.prototype.setBankIDAccount = function(BankIDAccount) {
      return angular.forEach(BankIDAccount.customer, function(value, key) {
        switch (key) {
          case 'documents':
            var documents = new BankIDDocumentsFactory();
            documents.initialize(value);

            angular.forEach(documents.list, function(document) {
              var field = null;
              switch (document.type) {
                case 'passport':
                  field = 'bankIdPassport';
              }
              if (field === null) {
                return;
              }
              if (this.hasParam(field)) {
                this.fields[field] = true;
                this.params[field].value = documents.getPassport();
              }
            }, this);
            break;
          case 'scans':
            var scans = new BankIDScansFactory();
            scans.initialize(value);
            angular.forEach(scans.list, function(scan) {
              this.params[field].upload(scan);
            }
            break;
          default:
            var field = 'bankId' + key;

            if (this.hasParam(field)) {
              this.fields[field] = true;
              this.params[field].value = value;
            }
            break;
        }
      }, this);
    };

    FormDataFactory.prototype.setFile = function(name, file) {
      var parameter = this.params[name];
      parameter.removeAll();
      parameter.addFiles([file]);
    };

    FormDataFactory.prototype.setFiles = function(name, files) {
      var parameter = this.params[name];
      parameter.removeAll();
      parameter.addFiles(files);
    };

    FormDataFactory.prototype.addFile = function(name, file) {
      var parameter = this.params[name];
      parameter.addFiles([file]);
    };

    FormDataFactory.prototype.addFiles = function(name, files) {
      var parameter = this.params[name];
      parameter.addFiles(files);
    };

    FormDataFactory.prototype.getRequestObject = function() {
      var data = {
        processDefinitionId: this.processDefinitionId,
        params: {}
      };
      for (var key in this.params) {
        var param = this.params[key];
        data.params[key] = param.get();
      }
      return data;
    };

    return FormDataFactory;
  });
});