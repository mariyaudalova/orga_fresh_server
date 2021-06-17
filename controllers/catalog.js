const Catalog = require('../models/Catalog');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addCategory = (req, res, next) => {
  Catalog.findOne({ id: req.body.id }).then(category => {
    if (category) {
      return res.status(400).json({ message: `Категория с id "${category.id}" уже существует` });
    } else {
      const newCategory = new Catalog(queryCreator(req.body));

      newCategory
        .save()
        .then(category => res.json(category))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.aupdateCategory = (req, res, next) => {
  Catalog.findOne({ id: req.params.id })
    .then(category => {
      if (!category) {
        return res.status(400).json({
          message: `Категория с id "${req.params.id}" не найдена.`,
        });
      } else {
        const initialQuery = _.cloneDeep(req.body);
        const updatedCategory = queryCreator(initialQuery);

        Catalog.findOneAndUpdate({ id: req.params.id }, { $set: updatedCategory }, { new: true })
          .then(category => res.json(category))
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

exports.deleteCategory = (req, res, next) => {
  Catalog.findOne({ id: req.params.id }).then(async category => {
    if (!category) {
      return res.status(400).json({
        message: `Категория с id "${req.params.id}" не найдена.`,
      });
    } else {
      const categoryToDelete = await Catalog.findOne({ id: req.params.id });

      Catalog.deleteOne({ id: req.params.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Категория с id "${categoryToDelete.id}" успешно удалена из БД.`,
            deletedCategoryInfo: categoryToDelete,
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

exports.getCategories = (req, res, next) => {
  Catalog.find()
    .then(catalog => res.send(catalog))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getCategory = (req, res, next) => {
  Catalog.findOne({ id: req.params.id })
    .then(category => {
      if (!category) {
        return res.status(400).json({
          message: `Категория с id "${req.params.id}" не найдена.`,
        });
      } else {
        res.status(200).json(category);
      }
    })
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
