var PT = new function () {
    this.baseName = 'pt';
    this.counter = 100;

    this.generatePrefix = function (baseName) {
        if (!baseName) {
           baseName = this.baseName;
        }
        return baseName + '-' + this.counter++;
    }

    return this;
};

