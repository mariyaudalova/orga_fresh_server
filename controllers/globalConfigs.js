const GlobalConfig = require('../models/GlobalConfig');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addConfig = (req, res, next) => {
  GlobalConfig.findOne({ customId: req.body.customId }).then(config => {
    if (config) {
      return res.status(400).json({
        message: `Настройки с customId "${config.customId}" уже существуют`,
      });
    } else {
      const configData = _.cloneDeep(req.body);
      const newConfig = new GlobalConfig(queryCreator(configData));

      newConfig
        .save()
        .then(config => res.status(200).json(config))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateConfig = (req, res, next) => {
  GlobalConfig.findOne({ customId: req.params.customId })
    .then(config => {
      if (!config) {
        return res.status(400).json({
          message: `Настройки с customId "${req.params.customId}" не найдены.`,
        });
      } else {
        const configData = _.cloneDeep(req.body);
        const updatedConfig = queryCreator(configData);

        GlobalConfig.findOneAndUpdate({ customId: req.params.customId }, { $set: updatedConfig }, { new: true })
          .then(config => res.json(config))
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

exports.deleteConfig = (req, res, next) => {
  GlobalConfig.findOne({ customId: req.params.customId }).then(async config => {
    if (!config) {
      return res.status(400).json({
        message: `Настройки с customId "${req.params.customId}" не найдены.`,
      });
    } else {
      const configToDelete = await GlobalConfig.findOne({
        customId: req.params.customId,
      });

      GlobalConfig.deleteOne({ customId: req.params.customId })
        .then(deletedCount =>
          res.status(200).json({
            message: `Настройки с именем "${configToDelete.customId}" успешно удалены из БД.`,
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

exports.getConfigs = (req, res, next) => {
  GlobalConfig.find()
    .then(configs => res.status(200).json(configs))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getConfigById = (req, res, next) => {
  GlobalConfig.findOne({ customId: req.params.customId })
    .then(configs => res.status(200).json(configs))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
