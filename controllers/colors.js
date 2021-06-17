const Color = require('../models/Color');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addColor = (req, res, next) => {
  Color.findOne({ name: req.body.name }).then(color => {
    if (color) {
      return res.status(400).json({ message: `Цвет с именем "${color.name}" уже существует` });
    } else {
      const initialQuery = _.cloneDeep(req.body);
      const newColor = new Color(queryCreator(initialQuery));

      newColor
        .save()
        .then(color => res.json(color))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateColor = (req, res, next) => {
  Color.findOne({ _id: req.params.id })
    .then(color => {
      if (!color) {
        return res.status(400).json({ message: `Цвет с id "${req.params.id}" не найден.` });
      } else {
        const initialQuery = _.cloneDeep(req.body);
        const updatedColor = queryCreator(initialQuery);

        Color.findOneAndUpdate({ _id: req.params.id }, { $set: updatedColor }, { new: true })
          .then(color => res.json(color))
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

exports.deleteColor = (req, res, next) => {
  Color.findOne({ _id: req.params.id }).then(async color => {
    if (!color) {
      return res.status(400).json({ message: `Цвет с id "${req.params.id}" не найден.` });
    } else {
      const colorToDelete = await Color.findOne({ _id: req.params.id });

      Color.deleteOne({ _id: req.params.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Цвет с именем "${colorToDelete.name}" успешно удален из БД `,
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

exports.getColors = (req, res, next) => {
  Color.find()
    .then(colors => res.json(colors))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
