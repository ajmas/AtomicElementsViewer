function Filter (name, propertyName, options) {
    this.name = name;
    this.enabled = false;
    this.propertyName = propertyName;
    this.prefix = PT.generatePrefix();
    this.options = options || {};


    this.getDisplayName = function () {
        return this.name;
    };

    this.getName = function () {
        return this.name;
    };

    this.createHtml = function () {
        return '';
    };

    this.matches = function (value) {
        return true;
    };

    this.isEnabled = function () {
        return this.enabled;
    }

}
