const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.createWishlist = (req, res, next) => {
  Wishlist.findOne({ customerId: req.user.id }).then(wishlist => {
    if (wishlist) {
      return res.status(400).json({ message: `Список желаний для этого покупателя уже существует` });
    } else {
      const wishlistData = _.cloneDeep(req.body);
      wishlistData.customerId = req.user.id;

      const newWishlist = new Wishlist(queryCreator(wishlistData));

      newWishlist.populate('products').populate('customerId').execPopulate();

      newWishlist
        .save()
        .then(wishlist => res.json(wishlist))
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateWishlist = (req, res, next) => {
  Wishlist.findOne({ customerId: req.user.id })
    .then(wishlist => {
      if (!wishlist) {
        const wishlistData = _.cloneDeep(req.body);
        wishlistData.customerId = req.user.id;

        const newWishlist = new Wishlist(queryCreator(wishlistData));

        newWishlist.populate('products').populate('customerId').execPopulate();

        newWishlist
          .save()
          .then(wishlist => res.json(wishlist))
          .catch(err =>
            res.status(400).json({
              message: `Произошла ошибка на сервере: "${err}" `,
            })
          );
      } else {
        const wishlistData = _.cloneDeep(req.body);
        const updatedWishlist = queryCreator(wishlistData);

        Wishlist.findOneAndUpdate({ customerId: req.user.id }, { $set: updatedWishlist }, { new: true })
          .populate('products')
          .populate('customerId')
          .then(wishlist => res.json(wishlist))
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

exports.addProductToWishlist = async (req, res, next) => {
  let productToAdd;

  try {
    productToAdd = await Product.findOne({ _id: req.params.productId });
  } catch (err) {
    res.status(400).json({
      message: `Произошла ошибка на сервере: "${err}" `,
    });
  }

  if (!productToAdd) {
    res.status(400).json({
      message: `Продукт с id (ObjectId) "${req.params.productId}" не существует`,
    });
  } else {
    Wishlist.findOne({ customerId: req.user.id })
      .then(wishlist => {
        if (!wishlist) {
          const wishlistData = {};
          wishlistData.customerId = req.user.id;
          wishlistData.products = [].concat(req.params.productId);
          const newWishlist = new Wishlist(queryCreator(wishlistData));

          newWishlist.populate('products').populate('customerId').execPopulate();

          newWishlist
            .save()
            .then(wishlist => res.json(wishlist))
            .catch(err =>
              res.status(400).json({
                message: `Произошла ошибка на сервере: "${err}" `,
              })
            );
        } else {
          const wishlistData = {};
          wishlistData.products = wishlist.products.concat(req.params.productId);
          const updatedWishlist = queryCreator(wishlistData);

          Wishlist.findOneAndUpdate({ customerId: req.user.id }, { $set: updatedWishlist }, { new: true })
            .populate('products')
            .populate('customerId')
            .then(wishlist => res.json(wishlist))
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
  }
};

exports.deleteProductFromWishlish = async (req, res, next) => {
  Wishlist.findOne({ customerId: req.user.id })
    .then(wishlist => {
      if (!wishlist) {
        res.status(400).json({ message: `Wishlist не существует` });
      } else {
        if (!wishlist.products.includes(req.params.productId)) {
          res.status(400).json({
            message: `Продукт с id "${req.params.productId}" отсутствует в списке желаний.`,
          });

          return;
        }

        const wishlistData = {};
        wishlistData.products = wishlist.products.filter(elem => elem.toString() !== req.params.productId);

        const updatedWishlist = queryCreator(wishlistData);

        if (wishlistData.products.length === 0) {
          return Wishlist.deleteOne({ customerId: req.user.id })
            .then(deletedCount =>
              res.status(200).json({
                products: [],
              })
            )
            .catch(err =>
              res.status(400).json({
                message: `Произошла ошибка на сервере: "${err}" `,
              })
            );
        }

        Wishlist.findOneAndUpdate({ customerId: req.user.id }, { $set: updatedWishlist }, { new: true })
          .populate('products')
          .populate('customerId')
          .then(wishlist => res.json(wishlist))
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

exports.deleteWishlist = (req, res, next) => {
  Wishlist.findOne({ customerId: req.user.id }).then(async wishlist => {
    if (!wishlist) {
      return res.status(400).json({ message: `Список желаний для этого покупателя не найден.` });
    } else {
      const wishlistToDelete = await Wishlist.findOne({
        customerId: req.user.id,
      });

      Wishlist.deleteOne({ customerId: req.user.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Список желаний с id "${wishlistToDelete._id}" успешно удален из БД`,
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

exports.getWishlist = (req, res, next) => {
  Wishlist.findOne({ customerId: req.user.id })
    .populate('products')
    .populate('customerId')
    .then(wishlist => res.json(wishlist))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
