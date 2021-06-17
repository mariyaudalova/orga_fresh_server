const Subscriber = require('../models/Subscriber');
const sendMail = require('../commonHelpers/mailSender');
const queryCreator = require('../commonHelpers/queryCreator');
const _ = require('lodash');

exports.addSubscriber = (req, res, next) => {
  if (!req.body.letterSubject || !req.body.letterHtml) {
    res.status(400).json({
      message: 'Тема (letterSubject) и содержание (letterHtml) обязательны.',
    });

    return;
  }

  const subscriberMail = req.body.email;
  const letterSubject = req.body.letterSubject;
  const letterHtml = req.body.letterHtml;

  if (!letterSubject) {
    return res.status(400).json({
      message: "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterSubject'",
    });
  }

  if (!letterHtml) {
    return res.status(400).json({
      message: "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterHtml'.",
    });
  }

  Subscriber.findOne({ email: req.body.email }).then(subscriber => {
    if (subscriber && subscriber.enabled) {
      return res.status(400).json({
        message: `Подписчик с email "${subscriber.email}" is уже существует`,
      });
    } else if (subscriber && !subscriber.enabled) {
      const initialQuery = _.cloneDeep(req.body);
      const updatedSubscriber = queryCreator(initialQuery);
      updatedSubscriber.enabled = true;

      Subscriber.findOneAndUpdate({ email: req.body.email }, { $set: updatedSubscriber }, { new: true })
        .then(async subscriber => {
          const mailResult = await sendMail(subscriberMail, letterSubject, letterHtml, res);
          res.json({
            subscriber,
            mailResult,
          });
        })
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    } else {
      const initialQuery = _.cloneDeep(req.body);
      const newSubscriber = new Subscriber(queryCreator(initialQuery));

      newSubscriber
        .save()
        .then(async subscriber => {
          const mailResult = await sendMail(subscriberMail, letterSubject, letterHtml, res);

          res.json({
            subscriber,
            mailResult,
          });
        })
        .catch(err =>
          res.status(400).json({
            message: `Произошла ошибка на сервере: "${err}" `,
          })
        );
    }
  });
};

exports.updateSubscriberById = (req, res, next) => {
  const subscriberMail = req.body.email;
  const letterSubject = req.body.letterSubject;
  const letterHtml = req.body.letterHtml;

  if (!letterSubject) {
    return res.status(400).json({
      message: "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterSubject'",
    });
  }

  if (!letterHtml) {
    return res.status(400).json({
      message: "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterHtml'.",
    });
  }

  Subscriber.findOne({ _id: req.params.id })
    .then(subscriber => {
      if (!subscriber) {
        return res.status(400).json({
          message: `Подписчик с id "${req.params.id}" не найден.`,
        });
      } else {
        const initialQuery = _.cloneDeep(req.body);
        const updatedSubscriber = queryCreator(initialQuery);

        Subscriber.findOneAndUpdate({ _id: req.params.id }, { $set: updatedSubscriber }, { new: true })
          .then(async subscriber => {
            const mailResult = await sendMail(subscriberMail, letterSubject, letterHtml, res);

            res.json({
              subscriber,
              mailResult,
            });
          })
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

exports.updateSubscriberByEmail = (req, res, next) => {
  const subscriberMail = req.params.email;
  const letterSubject = req.body.letterSubject;
  const letterHtml = req.body.letterHtml;

  if (!letterSubject) {
    return res.status(400).json({
      message:
        "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterSubject'.",
    });
  }

  if (!letterHtml) {
    return res.status(400).json({
      message: "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterHtml'.",
    });
  }

  Subscriber.findOne({ email: req.params.email })
    .then(subscriber => {
      if (!subscriber) {
        return res.status(400).json({
          message: `Подписчик с id "${req.params.email}" не найден.`,
        });
      } else {
        const initialQuery = _.cloneDeep(req.body);
        const updatedSubscriber = queryCreator(initialQuery);

        Subscriber.findOneAndUpdate({ email: req.params.email }, { $set: updatedSubscriber }, { new: true })
          .then(async subscriber => {
            const mailResult = await sendMail(subscriberMail, letterSubject, letterHtml, res);

            res.json({
              subscriber,
              mailResult,
            });
          })
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

exports.getSubscribers = (req, res, next) => {
  Subscriber.find()
    .then(subscribers => res.json(subscribers))
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};

exports.getSubscriber = (req, res, next) => {
  Subscriber.findOne({ email: req.params.email })
    .then(subscriber => {
      if (!subscriber) {
        return res.status(400).json({
          message: `Подписчик с id "${req.params.email}" не найден.`,
        });
      } else {
        res.json(subscriber);
      }
    })
    .catch(err =>
      res.status(400).json({
        message: `Произошла ошибка на сервере: "${err}" `,
      })
    );
};
