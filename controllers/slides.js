const Slider = require('../models/Slider');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addSlide = (req, res, next) => {
  Slider.findOne({ customId: req.body.customId }).then(slide => {
    if (slide) {
      res.status(400).json({
        message: `Слайд с customId '${slide.customId}' уже существует. CutomId должен быть уникальным.`,
      });
    } else {
      const slideData = _.cloneDeep(req.body);
      const newSlide = new Slider(queryCreator(slideData));

      newSlide.populate('product').populate('category').populate('customer').execPopulate();

      newSlide
        .save()
        .then(slide => res.json(slide))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateSlide = (req, res, next) => {
  Slider.findOne({ customId: req.params.customId })
    .then(slide => {
      if (!slide) {
        return res.status(400).json({
          message: `Слайд с customId "${req.params.customId}" не найден.`,
        });
      } else {
        const slideData = _.cloneDeep(req.body);
        const updatedSlide = queryCreator(slideData);

        Slider.findOneAndUpdate({ customId: req.params.customId }, { $set: updatedSlide }, { new: true })
          .populate('product')
          .populate('category')
          .populate('customer')
          .then(slide => res.json(slide))
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

exports.deleteSlide = (req, res, next) => {
  Slider.findOne({ customId: req.params.customId }).then(async slide => {
    if (!slide) {
      return res.status(400).json({
        message: `Слайд с customId "${req.params.customId}" не найден.`,
      });
    } else {
      const slideToDelete = await Slider.findOne({
        customId: req.params.customId,
      });

      Slider.deleteOne({ customId: req.params.customId })
        .then(deletedCount =>
          res.status(200).json({
            message: `Слайд с customId "${slideToDelete.customId}" успешно удален из БД.`,
            deletedSlideInfo: slideToDelete,
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

exports.getSlides = (req, res, next) => {
  Slider.find()
    .populate('product')
    .populate('category')
    .populate('customer')
    .then(slides => res.status(200).json(slides))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
