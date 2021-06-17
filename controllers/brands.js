const Brand = require('../models/Brand');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addBrand = (req, res, next) => {
  Brand.findOne({ name: req.body.name }).then(brand => {
    if (brand) {
      return res.status(400).json({ message: `Бренд с названием "${brand.name}" уже существует` });
    } else {
      const initialQuery = _.cloneDeep(req.body);
      const newBrand = new Brand(queryCreator(initialQuery));

      newBrand
        .save()
        .then(brand => res.json(brand))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateBrand = (req, res, next) => {
  Brand.findOne({ _id: req.params.id })
    .then(brand => {
      if (!brand) {
        return res.status(400).json({ message: `Бренд с id "${req.params.id}" не найден.` });
      } else {
        const initialQuery = _.cloneDeep(req.body);
        const updatedBrand = queryCreator(initialQuery);

        Brand.findOneAndUpdate({ _id: req.params.id }, { $set: updatedBrand }, { new: true })
          .then(brand => res.json(brand))
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

exports.deleteBrand = (req, res, next) => {
  Brand.findOne({ _id: req.params.id }).then(async brand => {
    if (!brand) {
      return res.status(400).json({ message: `Бренд с id "${req.params.id}" не найден.` });
    } else {
      const brandToDelete = await Brand.findOne({ _id: req.params.id });

      Brand.deleteOne({ _id: req.params.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Бренд с названием "${brandToDelete.name}" успешно удален из БД `,
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

exports.getBrands = (req, res, next) => {
  Brand.find()
    .then(brands => res.json(brands))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
