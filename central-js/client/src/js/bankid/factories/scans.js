define('bankid/scans/factory', ['angularAMD', 'bankid/scan/factory'], function(angularAMD) {
	angularAMD.factory('BankIDScansFactory', [
		'BankIDScanFactory',
		function(ScanFactory) {
			var scans = function() {
				this.list = [];
			};

			scans.prototype.initialize = function(list) {
				angular.forEach(list, function(value, key) {
					var element = new ScanFactory();
					element.initialize(value);

					this.list.push(element);
				}, this);
			};

			return scans;
		}
	]);
});