const Filter = require('../models/Filter');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addFilter = (req, res, next) => {
  Filter.findOne({ name: req.body.name, type: req.body.type }).then(filter => {
    if (filter) {
      return res.status(400).json({
        message: `Фильтр с типом "${filter.type}" и именем "${filter.name}" не найден`,
      });
    } else {
      const initialQuery = _.cloneDeep(req.body);
      const newFilter = new Filter(queryCreator(initialQuery));

      newFilter
        .save()
        .then(filter => res.json(filter))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateFilter = (req, res, next) => {
  Filter.findOne({ _id: req.params.id })
    .then(filter => {
      if (!filter) {
        return res.status(400).json({
          message: `Фильтр с id "${req.params.id}" не найден.`,
        });
      } else {
        const initialQuery = _.cloneDeep(req.body);
        const updatedFilter = queryCreator(initialQuery);

        Filter.findOneAndUpdate({ _id: req.params.id }, { $set: updatedFilter }, { new: true })
          .then(filter => res.json(filter))
          .catch(err =>
            res.status(400).json({
              message: `Произошла ошибка на сервере: "${err}" `,
            })
          );
      }
    })
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.deleteFilter = (req, res, next) => {
  Filter.findOne({ _id: req.params.id }).then(async filter => {
    if (!filter) {
      return res.status(400).json({ message: `Фильтер с id "${req.params.id}" не найден.` });
    } else {
      const filterToDelete = await Filter.findOne({ _id: req.params.id });

      Filter.deleteOne({ _id: req.params.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Фильтер с типом "${filterToDelete.type}" и именем "${filterToDelete.name}" успешно удален из БД `,
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

exports.getFilters = (req, res, next) => {
  Filter.find()
    .then(filters => res.json(filters))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getFiltersByType = (req, res, next) => {
  Filter.find({ type: req.params.type })
    .then(filters => res.json(filters))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
