define('bankid/scan/factory', ['angularAMD'], function (angularAMD) {
	angularAMD.factory('BankIDScanFactory', [
		function() {

			var scan = function() {
				this.type = 'passport';
			
				this.link = null;
				this.dateCreate = null;
				this.extension = null;
			};
			
			scan.prototype.initialize = function(scan) {
				this.type = scan.type;			
				this.link = scan.link;
				this.dateCreate = scan.dateCreate;
				this.extension = scan.extension;
			};
			
			return scan;
		}
	]);
});