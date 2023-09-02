const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        // To allow for nested route "GET cart on user" (hack)
        // let filter = {};
        // if (req.params.tourId) filter = { user: req.user.id };

        // Execute query
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const doc = await features.query;

        // send response
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });

exports.getOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findById(req.params.id);

        if (!doc) {
            // if null: there's no document // This logic is for handlers querying documents based on id
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.createOne = (Model, modelType) =>
    catchAsync(async (req, res, next) => {
        // this runs when we're creating a cart item and saved item, and fills the user field with the id gotten from d protect middleware
        if (modelType) req.body.user = req.user.id;

        const doc = await Model.create(req.body); // saves d document in d database & returns d newly creatd document with d id

        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            // if null: there's no document // This logic is for handlers querying documents based on id
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            // if null: there's no document // This logic is for handlers querying documents based on id
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: {
                data: null,
            },
        });
    });
