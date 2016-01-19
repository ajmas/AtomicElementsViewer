function FilterRegistry () {
    this.filters = [];
    this.filtersByName  = {};

    this.register = function (filter) {
        if (! this.filtersByName[filter.getName()]) {
            this.filters.push(filter);
            this.filtersByName[filter.getName()] = filter;
        }
    }

    this.getFilter = function (name) {
        return this.filtersByName[name];
    }

    this.getAllFilters = function () {
        return this.filters;
    }
}

