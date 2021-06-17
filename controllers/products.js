const Product = require('../models/Product');

const uniqueRandom = require('unique-random');
const rand = uniqueRandom(0, 999999);

const queryCreator = require('../commonHelpers/queryCreator');
const filterParser = require('../commonHelpers/filterParser');
const _ = require('lodash');

exports.addImages = (req, res, next) => {
  if (req.files.length > 0) {
    res.json({
      message: 'Фотографии получены',
    });
  } else {
    res.json({
      message: 'Что-то не так с получением фотографий на сервере. Пожалуйста, проверьте папку пути',
    });
  }
};

exports.addProduct = (req, res, next) => {
  const productFields = _.cloneDeep(req.body);

  productFields.itemNo = rand();

  try {
    productFields.name = productFields.name.toLowerCase().trim().replace(/\s\s+/g, ' ');

    // const imageUrls = req.body.previewImages.map(img => {
    //   return `/img/products/${productFields.itemNo}/${img.name}`;
    // });

    // productFields.imageUrls = _.cloneDeep(imageUrls);
  } catch (err) {
    res.status(400).json({
      message: `Произошла ошибка на сервере: "${err}" `,
    });
  }

  const updatedProduct = queryCreator(productFields);

  const newProduct = new Product(updatedProduct);

  newProduct
    .save()
    .then(product => res.json(product))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.updateProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then(product => {
      if (!product) {
        return res.status(400).json({
          message: `Продукт с id "${req.params.id}" не найден.`,
        });
      } else {
        const productFields = _.cloneDeep(req.body);

        try {
          productFields.name = productFields.name.toLowerCase().trim().replace(/\s\s+/g, ' ');
        } catch (err) {
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          });
        }

        const updatedProduct = queryCreator(productFields);

        Product.findOneAndUpdate({ _id: req.params.id }, { $set: updatedProduct }, { new: true })
          .then(product => res.json(product))
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

exports.getProducts = (req, res, next) => {
  const perPage = Number(req.query.perPage);
  const startPage = Number(req.query.startPage);
  const sort = req.query.sort;

  Product.find()
    .skip(startPage * perPage - perPage)
    .limit(perPage)
    .sort(sort)
    .then(products => res.send(products))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getProductById = (req, res, next) => {
  Product.findOne({
    itemNo: req.params.itemNo,
  })
    .then(product => {
      if (!product) {
        res.status(400).json({
          message: `Продукт с itemNo ${req.params.itemNo} не найден`,
        });
      } else {
        res.json(product);
      }
    })
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getProductsFilterParams = async (req, res, next) => {
  const mongooseQuery = filterParser(req.query);
  const perPage = Number(req.query.perPage);
  const startPage = Number(req.query.startPage);
  const sort = req.query.sort;

  try {
    const products = await Product.find(mongooseQuery)
      .skip(startPage * perPage - perPage)
      .limit(perPage)
      .sort(sort);

    const productsQuantity = await Product.find(mongooseQuery);

    res.json({ products, productsQuantity: productsQuantity.length });
  } catch (err) {
    res.status(400).json({
      message: `Произошла ошибка на сервере: "${err}" `,
    });
  }
};

exports.searchProducts = async (req, res, next) => {
  if (!req.body.query) {
    res.status(400).json({ message: 'Строка запроса пуста' });
  }

  //Taking the entered value from client in lower-case and trimed
  let query = req.body.query.toLowerCase().trim().replace(/\s\s+/g, ' ');

  // Creating the array of key-words from taken string
  let queryArr = query.split(' ');

  // Finding ALL products, that have at least one match
  let matchedProducts = await Product.find({
    $text: { $search: query },
  });

  res.send(matchedProducts);
};

exports.getProductByColor = (req, res, next) => {
  Product.find({
    descForColor: req.body.descForColor,
  })
    .then(async products => {
      if (!products) {
        res.status(400).json({
          message: `Продукты типа ${req.body.descForColor} не найдены`,
        });
      } else {
        res.json(products);
      }
    })
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getProductsByArrayId = (req, res, next) => {
  Product.find({
    itemNo: req.body.itemNo,
  })
    .then(async products => {
      if (!products) {
        res.status(400).json({
          message: `Продукты ${req.body.itemNo} не найдены`,
        });
      } else {
        res.json(products);
      }
    })
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
