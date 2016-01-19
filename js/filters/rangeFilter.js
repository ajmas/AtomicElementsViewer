function RangeFilter (name, propertyName, options) {
    this.prototype = Object.create( Filter.prototype );

    Filter.call(this, name, propertyName, options);

    if (options) {
       this.unit = options.unit;
    }

    this.getHtml = function () {
        return '<input name="' + this.prefix + '-min" type="text" size="6">'
            + ' - '
            + ' <input name="' + this.prefix + '-max" type="text" size="6">'
            + (this.unit?' ' + this.unit:'');

    }

    this.matches = function (value) {
        var min, max;
        min = $('#' + this.prefix + '-min');
        max = $('#' + this.prefix + '-max');
        return ( min < value[this.properyName] && max > value[this.properyName] );
    }
}

