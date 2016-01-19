//
// Description
// -----------
//
// Implements of a boolean filter, where the property take a true/false
// state. If the property does not exist, then it will be treated as 'false'
//
// External Dependencies
// ---------------------
//
//  - jQuery

function BooleanFilter (name, propertyName, options) {
    this.prototype = Object.create( Filter.prototype );

    Filter.call(this, name, propertyName, options);

    this.mode = 'checkbox';

    if (options) {
        this.mode = options.mode;
        this.state = options.defaultState;
    }

    this.getHtml = function () {
        if (this.mode === 'combobox') {
            return '<select name="' + this.prefix + '-min">'
               + '<option value="1">yes</option>'
               + '<option value="0" selected>no</option>'
               + '</select>';
        } else {
            return '<input name="' + this.prefix + '" type="checkbox" />';
        }
    }

    this.matches = function (value) {
        var checked;
        if (this.mode === 'combobox') {
            checked = ($('#' + this.prefix).val() === 1);
        } else {
            checked = $('#' + this.prefix + ':checked');
        }
        return ( checked  && value[this.propertyName] === true);
    }
}


// move to test file

// var myBool = new BooleanFilter('Radioactive', 'radioactive');
//
// myObj = {
//    'radioactive': true
// }
//
// myObj2 = {
//    'radioactive': false
// }
//
// console.log(myBool.matches(myObj));