const Error = require('../models/Error');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addError = (req, res, next) => {
  const initialQuery = _.cloneDeep(req.body);
  const newError = new Error(queryCreator(initialQuery));

  newError
    .save()
    .then(error => res.json(error))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.deleteError = (req, res, next) => {
  Error.findOne({ _id: req.params.id }).then(async error => {
    if (!error) {
      return res.status(400).json({ message: `Ошибка с id "${req.params.id}" не найдена.` });
    } else {
      const errorToDelete = await Error.findOne({ _id: req.params.id });

      Error.deleteOne({ _id: req.params.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Ошибка с id "${errorToDelete.message}" успешно удалена из БД `,
          })
        )
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.getErrors = (req, res, next) => {
  Error.find()
    .then(errors => res.json(errors))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
