class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1a) Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]); // delete the excluded fields

        // 1b) Advanced Filtering  // formating for the operator ($) // operators gte, gt, lte, lt
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this; // returns d class object which has access to the prototypes(methods)
    }

    sort() {
        // 2 sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' '); // sorts the sort string
            this.query = this.query.sort(sortBy); // sort is a query prototype funct
            // query.sort('price ratingsAverage')
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        // 3 field limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields); // includes fields that displays
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        // 4) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100; // ideally the user will only specify the "page" no, and not specify the limit
        // const limit = this.queryString.limit * 1 || 24;
        const skip = (page - 1) * limit;

        // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
