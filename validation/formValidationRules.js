const FormValidator = require('./FormValidator');
const moment = require('moment');

// Rules for all form fields for validation
const formValidationRules = [
  {
    field: 'firstName',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: 'Имя обязательно.',
  },
  {
    field: 'firstName',
    method: 'matches',
    validWhen: true,
    args: [/^[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ']+$/],
    message: 'Допустимые символы для имени: a-z, A-Z, а-я, А-Я.',
  },
  {
    field: 'firstName',
    method: 'isLength',
    validWhen: true,
    args: [{ min: 2, max: 25 }],
    message: 'Имя должно содержать от 2 до 25 символов',
  },
  {
    field: 'lastName',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: 'Фамилия обязательна.',
  },
  {
    field: 'lastName',
    method: 'matches',
    validWhen: true,
    args: [/^[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ']+$/],
    message: 'Допустимые символы для фамилии: a-z, A-Z, а-я, А-Я.',
  },
  {
    field: 'lastName',
    method: 'isLength',
    validWhen: true,
    args: [{ min: 2, max: 25 }],
    message: 'Фамилия должна содержать от 2 до 25 символов',
  },
  {
    field: 'email',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: 'Электронная почта обязательна.',
  },
  {
    field: 'email',
    method: 'isEmail',
    validWhen: true,
    message: 'Это недействительный адрес электронной почты.',
  },
  {
    field: 'login',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: 'Логин обязателен.',
  },
  {
    field: 'login',
    method: 'matches',
    validWhen: true,
    args: [/^[a-zA-Z0-9]+$/],
    message: 'Допустимые символы для логина: a-z, A-Z, 0-9.',
  },
  {
    field: 'login',
    method: 'isLength',
    validWhen: true,
    args: [{ min: 3, max: 10 }],
    message: 'Логин должен содержать от 3 до 10 символов',
  },
  {
    field: 'loginOrEmail',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: 'Требуется логин или электронная почта.',
  },
  {
    field: 'password',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: 'Пароль обязателен.',
  },
  {
    field: 'password',
    method: 'matches',
    validWhen: true,
    args: [/^[a-zA-Z0-9]+$/],
    message: 'Допустимые символы для пароля: a-z, A-Z, 0-9.',
  },
  {
    field: 'password',
    method: 'isLength',
    validWhen: true,
    args: [{ min: 7, max: 30 }],
    message: 'Пароль должен содержать от 7 до 30 символов',
  },
  {
    field: 'newPassword',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: 'Требуется новый пароль.',
  },
  {
    field: 'newPassword',
    method: 'matches',
    validWhen: true,
    args: [/^[a-zA-Z0-9]+$/],
    message: 'Допустимые символы для пароля: a-z, A-Z, 0-9.',
  },
  {
    field: 'newPassword',
    method: 'isLength',
    validWhen: true,
    args: [{ min: 7, max: 30 }],
    message: 'Пароль должен содержать от 7 до 30 символов',
  },
  {
    field: 'telephone',
    method: 'matches',
    args: [/^\+380\d{3}\d{2}\d{2}\d{2}$/],
    validWhen: true,
    message: 'Это недействительный номер телефона.',
  },
  {
    field: 'isAdmin',
    method: 'isBoolean',
    validWhen: true,
    message: 'Поле isAdmin должно быть истинным или ложным',
  },
  {
    field: 'enabled',
    method: 'isBoolean',
    validWhen: true,
    message: 'Поле isAdmin должно быть истинным или ложным',
  },
  {
    field: 'letterSubject',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterSubject'.",
  },
  {
    field: 'letterHtml',
    method: FormValidator.isEmpty,
    validWhen: false,
    message: "Эта операция предполагает отправку письма клиенту. Пожалуйста, укажите для письма поле 'letterHtml'.",
  },
];

module.exports = formValidationRules;
