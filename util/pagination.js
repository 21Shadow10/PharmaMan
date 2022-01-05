exports.paginatedResults = model => {
    return async(req, res, next) => {
        var page;
        var limit;
        var search;
        var sorted = req.query.sort;
        var obj = {};
        obj[sorted] = 1;
        if (req.query.page == undefined) {
            page = 1;
        } else {
            page = parseInt(req.query.page);
        }
        if (req.query.limit == undefined) limit = 8;
        else {
            limit = parseInt(req.query.limit);
        }
        if (req.query.search == undefined || req.query.search == '')
            req.query.search = '';
        else {
            search = req.query.search;
        }
        //console.log(page + ' ' + limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        if (endIndex < (await model.countDocuments().exec())) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        try {
            if (req.query.search == undefined || req.query.search == '') {
                results.results = await model
                    .find()
                    .sort(obj)
                    .limit(limit)
                    .skip(startIndex)
                    .exec();
            } else {
                results.results = await model
                    .find({ name: { $regex: `${search}` } })
                    .sort(obj)
                    .limit(limit)
                    .skip(startIndex)
                    .exec();
            }
            var products = results.results;

            const prod = [];
            var chunkSize = 4;
            for (let i = 0; i < products.length; i += chunkSize) {
                const chunk = products.slice(i, i + chunkSize);
                prod.push(chunk);
            }
            results.results = prod;
            results.search = search;
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}