const ShippingMethod = require('../models/ShippingMethod');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addShippingMethod = (req, res, next) => {
  ShippingMethod.findOne({ customId: req.body.customId }).then(shippingMethod => {
    if (shippingMethod) {
      return res.status(400).json({
        message: `Способ доставки с customId "${shippingMethod.customId}" уже существует`,
      });
    } else {
      const data = _.cloneDeep(req.body);
      const newShippingMethod = new ShippingMethod(queryCreator(data));

      newShippingMethod
        .save()
        .then(shippingMethod => res.status(200).json(shippingMethod))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateShippingMethod = (req, res, next) => {
  ShippingMethod.findOne({ customId: req.params.customId })
    .then(shippingMethod => {
      if (!shippingMethod) {
        return res.status(400).json({
          message: `Способ доставки с customId "${req.params.customId}" не найден.`,
        });
      } else {
        const data = _.cloneDeep(req.body);
        const updatedShippingMethod = queryCreator(data);

        ShippingMethod.findOneAndUpdate(
          { customId: req.params.customId },
          { $set: updatedShippingMethod },
          { new: true }
        )
          .then(shippingMethod => res.json(shippingMethod))
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

exports.deleteShippingMethod = (req, res, next) => {
  ShippingMethod.findOne({ customId: req.params.customId }).then(async shippingMethod => {
    if (!shippingMethod) {
      return res.status(400).json({
        message: `Способ доставки с customId "${req.params.customId}" не найден.`,
      });
    } else {
      const shippingMethodToDelete = await ShippingMethod.findOne({
        customId: req.params.customId,
      });

      ShippingMethod.deleteOne({ customId: req.params.customId })
        .then(deletedCount =>
          res.status(200).json({
            message: `Способ доставки с именем "${shippingMethodToDelete.customId}" успешно удален из БД `,
            deletedDocument: shippingMethodToDelete,
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

exports.getShippingMethods = (req, res, next) => {
  ShippingMethod.find()
    .then(shippingMethods => res.status(200).json(shippingMethods))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getShippingMethodById = (req, res, next) => {
  ShippingMethod.findOne({ customId: req.params.customId })
    .then(shippingMethod => res.status(200).json(shippingMethod))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
