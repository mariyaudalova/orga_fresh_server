const PaymentMethod = require('../models/PaymentMethod');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addPaymentMethod = (req, res, next) => {
  PaymentMethod.findOne({ customId: req.body.customId }).then(paymentMethod => {
    if (paymentMethod) {
      return res.status(400).json({
        message: `Способ оплаты с customId "${paymentMethod.customId}" уже существует`,
      });
    } else {
      const data = _.cloneDeep(req.body);
      const newPaymentMethod = new PaymentMethod(queryCreator(data));

      newPaymentMethod
        .save()
        .then(paymentMethod => res.status(200).json(paymentMethod))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updatePaymentMethod = (req, res, next) => {
  PaymentMethod.findOne({ customId: req.params.customId })
    .then(paymentMethod => {
      if (!paymentMethod) {
        return res.status(400).json({
          message: `Способ оплаты с customId "${req.params.customId}" не найден.`,
        });
      } else {
        const data = _.cloneDeep(req.body);
        const updatedPaymentMethod = queryCreator(data);

        PaymentMethod.findOneAndUpdate({ customId: req.params.customId }, { $set: updatedPaymentMethod }, { new: true })
          .then(paymentMethod => res.json(paymentMethod))
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

exports.deletePaymentMethod = (req, res, next) => {
  PaymentMethod.findOne({ customId: req.params.customId }).then(async paymentMethod => {
    if (!paymentMethod) {
      return res.status(400).json({
        message: `Способ оплаты с customId "${req.params.customId}" не найден.`,
      });
    } else {
      const paymentMethodToDelete = await PaymentMethod.findOne({
        customId: req.params.customId,
      });

      PaymentMethod.deleteOne({ customId: req.params.customId })
        .then(deletedCount =>
          res.status(200).json({
            message: `Способ оплаты с именем "${paymentMethodToDelete.customId}" успешно удален из БД.`,
            deletedDocument: paymentMethodToDelete,
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

exports.getPaymentMethods = (req, res, next) => {
  PaymentMethod.find()
    .then(paymentMethods => res.status(200).json(paymentMethods))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getPaymentMethodById = (req, res, next) => {
  PaymentMethod.findOne({ customId: req.params.customId })
    .then(paymentMethod => res.status(200).json(paymentMethod))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
