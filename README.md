1. Backend
- filter: [field_name]_[option]=[value]
    + Example: GET /api/v1/companies?number_of_employees_gt=10 // this returns companies that has number_of_employees > 10
    + Example: GET /api/v1/companies?founded_year=2012 // this return companies that was founded in 2010
    + Options:
        * gt: greater than
        * lt: less than
        * gte: less and equal
        * gte: greater and equal
        * ne: not equal
        * in: in list
        * No need for option if you need equal filter
