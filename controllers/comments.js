const Comment = require('../models/Comment');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addComment = (req, res, next) => {
  const commentData = _.cloneDeep(req.body);
  commentData.customer = req.user.id;
  const newComment = new Comment(queryCreator(commentData));

  newComment.populate('product').populate('category').populate('customer').execPopulate();

  newComment
    .save()
    .then(comment => res.json(comment))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.updateComment = (req, res, next) => {
  Comment.findOne({ _id: req.params.id })
    .then(comment => {
      if (!comment) {
        return res.status(400).json({
          message: `Комментарий с id "${req.params.id}" не найден.`,
        });
      } else {
        const commentData = _.cloneDeep(req.body);
        const updatedComment = queryCreator(commentData);

        Comment.findOneAndUpdate({ _id: req.params.id }, { $set: updatedComment }, { new: true })
          .populate('product')
          .populate('category')
          .populate('customer')
          .then(comment => res.json(comment))
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

exports.deleteComment = (req, res, next) => {
  Comment.findOne({ _id: req.params.id }).then(async comment => {
    if (!comment) {
      return res.status(400).json({
        message: `Комментарий с id "${req.params.id}" не найден.`,
      });
    } else {
      const commentToDelete = await Comment.findOne({
        _id: req.params.id,
      });

      Comment.deleteOne({ _id: req.params.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Комментарий с id "${commentToDelete._id}" успешно удален из БД.`,
            deletedCommentInfo: commentToDelete,
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

exports.getComments = (req, res, next) => {
  Comment.find()
    .populate('product')
    .populate('category')
    .populate('customer')
    .then(comments => res.status(200).json(comments))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getCustomerComments = (req, res, next) => {
  Comment.find({ customer: req.params.customerId })
    .populate('product')
    .populate('category')
    .populate('customer')
    .then(comments => res.status(200).json(comments))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getProductComments = (req, res, next) => {
  Comment.find({ product: req.params.productId })
    .populate('product')
    .populate('category')
    .populate('customer')
    .sort('-date')
    .then(comments => res.status(200).json(comments))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
