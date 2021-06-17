const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../commonHelpers/mailSender');
const validateOrderForm = require('../validation/validationHelper');
const queryCreator = require('../commonHelpers/queryCreator');
const productAvailibilityChecker = require('../commonHelpers/productAvailibilityChecker');
const subtractProductsFromCart = require('../commonHelpers/subtractProductsFromCart');
const _ = require('lodash');

const uniqueRandom = require('unique-random');
const rand = uniqueRandom(1000000, 9999999);

exports.placeOrder = async (req, res, next) => {
  try {
    const order = _.cloneDeep(req.body);
    order.orderNo = String(rand());
    let cartProducts = [];

    if (req.body.deliveryAddress) {
      order.deliveryAddress = req.body.deliveryAddress;
    }

    if (req.body.shipping) {
      order.shipping = req.body.shipping;
    }

    if (req.body.paymentInfo) {
      order.paymentInfo = req.body.paymentInfo;
    }

    if (req.body.customerId) {
      order.customerId = req.body.customerId;

      cartProducts = await subtractProductsFromCart(order.customerId);
    }

    if (!req.body.products && cartProducts.length < 1) {
      res.status(400).json({ message: 'Перечень товаров обязателен, но отсутствует!' });
    }

    if (cartProducts.length > 0) {
      order.products = _.cloneDeep(cartProducts);
    } else {
      order.products = req.body.products;
    }

    order.totalSum = order.products.reduce(
      (sum, cartItem) => sum + cartItem.product.currentPrice * cartItem.cartQuantity,
      0
    );

    const productAvailibilityInfo = await productAvailibilityChecker(order.products);

    if (!productAvailibilityInfo.productsAvailibilityStatus) {
      res.json({
        message: 'Некоторые из ваших товаров сейчас недоступны',
        productAvailibilityInfo,
      });
    } else {
      const subscriberMail = req.body.email;
      const letterSubject = req.body.letterSubject;
      const letterHtml = req.body.letterHtml;

      const { errors, isValid } = validateOrderForm(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      if (!letterSubject) {
        return res.status(400).json({
          message:
            "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterSubject'.",
        });
      }

      if (!letterHtml) {
        return res.status(400).json({
          message:
            "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterHtml'.",
        });
      }

      const newOrder = new Order(order);

      if (order.customerId) {
        newOrder.populate('customerId').execPopulate();
      }

      newOrder
        .save()
        .then(async order => {
          const mailResult = await sendMail(subscriberMail, letterSubject, letterHtml, res);

          for (item of order.products) {
            const id = item.product._id;
            await Product.findOneAndUpdate({ _id: id }, { quantity: item.product.quantity - 1 }, { new: true });
          }

          res.json({ order, mailResult });
        })
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  } catch (err) {
    res.status(400).json({
      message: `Произошла ошибка на сервере: "${err}" `,
    });
  }
};

exports.updateOrder = (req, res, next) => {
  Order.findOne({ _id: req.params.id }).then(async currentOrder => {
    if (!currentOrder) {
      return res.status(400).json({ message: `Заказать с id ${req.params.id} не найден` });
    } else {
      const order = _.cloneDeep(req.body);

      if (req.body.deliveryAddress) {
        order.deliveryAddress = req.body.deliveryAddress;
      }

      if (req.body.shipping) {
        order.shipping = req.body.shipping;
      }

      if (req.body.paymentInfo) {
        order.paymentInfo = req.body.paymentInfo;
      }

      if (req.body.customerId) {
        order.customerId = req.body.customerId;
      }

      if (req.body.products) {
        order.products = req.body.products;

        order.totalSum = order.products.reduce(
          (sum, cartItem) => sum + cartItem.product.currentPrice * cartItem.cartQuantity,
          0
        );

        const productAvailibilityInfo = await productAvailibilityChecker(order.products);

        if (!productAvailibilityInfo.productsAvailibilityStatus) {
          res.json({
            message: 'Некоторые из ваших товаров сейчас недоступны',
            productAvailibilityInfo,
          });
        }
      }

      const subscriberMail = req.body.email;
      const letterSubject = req.body.letterSubject;
      const letterHtml = req.body.letterHtml;

      const { errors, isValid } = validateOrderForm(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      if (!letterSubject) {
        return res.status(400).json({
          message:
            "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterSubject'.",
        });
      }

      if (!letterHtml) {
        return res.status(400).json({
          message:
            "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterHtml'.",
        });
      }

      Order.findOneAndUpdate({ _id: req.params.id }, { $set: order }, { new: true })
        .populate('customerId')
        .then(async order => {
          const mailResult = await sendMail(subscriberMail, letterSubject, letterHtml, res);

          res.json({ order, mailResult });
        })
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.changeStatus = (req, res, next) => {
  Order.findOne({ _id: req.params.id }).then(async currentOrder => {
    if (!currentOrder) {
      return res.status(400).json({ message: `Заказать с id ${req.params.id} не найден` });
    } else {
      const order = _.cloneDeep(req.body);

      const { errors, isValid } = validateOrderForm(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      Order.findOneAndUpdate({ _id: req.params.id }, { $set: order }, { new: true })
        .populate('customerId')
        .then(async order => {
          res.json({ order });
        })
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.cancelOrder = (req, res, next) => {
  Order.findOne({ _id: req.params.id }).then(async currentOrder => {
    if (!currentOrder) {
      return res.status(400).json({ message: `Заказать с id ${req.params.id} не найден` });
    } else {
      const subscriberMail = req.body.email;
      const letterSubject = req.body.letterSubject;
      const letterHtml = req.body.letterHtml;

      const { errors, isValid } = validateOrderForm(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      if (!letterSubject) {
        return res.status(400).json({
          message:
            "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterSubject'.",
        });
      }

      if (!letterHtml) {
        return res.status(400).json({
          message:
            "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterHtml'.",
        });
      }

      Order.findOneAndUpdate({ _id: req.params.id }, { canceled: true }, { new: true })
        .populate('customerId')
        .then(async order => {
          const mailResult = await sendMail(subscriberMail, letterSubject, letterHtml, res);

          res.json({ order, mailResult });
        })
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.deleteOrder = (req, res, next) => {
  Order.findOne({ _id: req.params.id }).then(async order => {
    if (!order) {
      return res.status(400).json({ message: `Заказать с id ${req.params.id} не найден.` });
    } else {
      const orderToDelete = await Order.findOne({ _id: req.params.id });

      Order.deleteOne({ _id: req.params.id })
        .then(deletedCount =>
          res.status(200).json({
            message: `Заказ c id "${orderToDelete._id}" успешно удален из БД. Информация о заказе: ${orderToDelete}`,
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

exports.getCustommerOrders = (req, res, next) => {
  Order.find({ customerId: req.user.id })
    .populate('customerId')
    .then(orders => res.json(orders))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getAllOrders = async (req, res, next) => {
  const perPage = Number(req.query.perPage);
  const startPage = Number(req.query.startPage);
  const sort = req.query.sort;

  const findObj = {};

  if (req.query.status) {
    findObj.status = req.query.status;
  }

  try {
    const orders = await Order.find(findObj)
      .skip(startPage * perPage - perPage)
      .limit(perPage)
      .sort(sort);

    const ordersQuantity = await Order.find(findObj);

    res.json({ orders, ordersQuantity: ordersQuantity.length });
  } catch (err) {
    res.status(400).json({
      message: `Произошла ошибка на сервере: "${err}" `,
    });
  }
};

exports.getOrder = (req, res, next) => {
  Order.findOne({ orderNo: req.params.orderNo })
    .populate('customerId')
    .then(order => res.json(order))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
