const Page = require('../models/Page');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addPage = (req, res, next) => {
  Page.findOne({ customId: req.body.customId }).then(page => {
    if (page) {
      res.status(400).json({
        message: `Страница с customId '${page.customId}' уже существует. cutomId должен быть уникальным.`,
      });
    } else {
      const pageData = _.cloneDeep(req.body);
      const newPage = new Page(queryCreator(pageData));

      newPage
        .save()
        .then(page => res.json(page))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updatePage = (req, res, next) => {
  Page.findOne({ customId: req.params.customId })
    .then(page => {
      if (!page) {
        return res.status(400).json({
          message: `Страница с customId "${req.params.customId}" не найдена.`,
        });
      } else {
        const pageData = _.cloneDeep(req.body);
        const updatedPage = queryCreator(pageData);

        Page.findOneAndUpdate({ customId: req.params.customId }, { $set: updatedPage }, { new: true })
          .then(page => res.json(page))
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

exports.deletePage = (req, res, next) => {
  Page.findOne({ customId: req.params.customId }).then(async page => {
    if (!page) {
      return res.status(400).json({
        message: `Страница с customId "${req.params.customId}" не найдена.`,
      });
    } else {
      const pageToDelete = await Page.findOne({
        customId: req.params.customId,
      });

      Page.deleteOne({ customId: req.params.customId })
        .then(deletedCount =>
          res.status(200).json({
            message: `Страница с customId "${pageToDelete.customId}" успешно удалена из БД.`,
            deletedPageInfo: pageToDelete,
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

exports.getPage = (req, res, next) => {
  Page.findOne({ customId: req.params.customId })
    .then(page => {
      if (!page) {
        res.status(400).json({
          message: `Страница с customId "${req.params.customId}" не найдена.`,
        });
      } else {
        res.status(200).json(page);
      }
    })
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
