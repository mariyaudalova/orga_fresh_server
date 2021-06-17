const Partner = require('../models/Partner');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addPartner = (req, res, next) => {
  Partner.findOne({ customId: req.body.customId }).then(partner => {
    if (partner) {
      return res.status(400).json({
        message: `Партнер с customId "${partner.customId}" уже существует`,
      });
    } else {
      const data = _.cloneDeep(req.body);
      const newPartner = new Partner(queryCreator(data));

      newPartner
        .save()
        .then(partner => res.status(200).json(partner))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updatePartner = (req, res, next) => {
  Partner.findOne({ customId: req.params.customId })
    .then(partner => {
      if (!partner) {
        return res.status(400).json({
          message: `Партнер с customId "${req.params.customId}" не найден.`,
        });
      } else {
        const data = _.cloneDeep(req.body);
        const updatedPartner = queryCreator(data);

        Partner.findOneAndUpdate({ customId: req.params.customId }, { $set: updatedPartner }, { new: true })
          .then(partner => res.json(partner))
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

exports.deletePartner = (req, res, next) => {
  Partner.findOne({ customId: req.params.customId }).then(async partner => {
    if (!partner) {
      return res.status(400).json({
        message: `Партнер с customId "${req.params.customId}" не найден.`,
      });
    } else {
      const partnerToDelete = await Partner.findOne({
        customId: req.params.customId,
      });

      Partner.deleteOne({ customId: req.params.customId })
        .then(deletedCount =>
          res.status(200).json({
            message: `Партнер с именем "${partnerToDelete.customId}" успешно удален из БД.`,
            deletedDocument: partnerToDelete,
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

exports.getPartners = (req, res, next) => {
  Partner.find()
    .then(partners => res.status(200).json(partners))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
