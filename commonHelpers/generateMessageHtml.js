exports.messageHeader = (url, logoSrc, customer) => {
  const logo = `
    <a href="${url}" target="_blank" style="padding-bottom:10px;">
    <img src="${logoSrc}" width="200" height="60" alt="logo">
    </a>`;

  const greeting = `<div style="font-size:14px;padding-bottom:15px;font-family:Arial, sans-serif;">
    Здравствуйте, ${customer.firstName} ${customer.lastName}!</div>`;

  const mobile = `<div>
    <a style="color:#000; text-decoration:none;" href="tel:+380440000000">
    044 000-00-00 </a>
    <a style="color:#000;text-decoration:none;" href="tel:+380950000000">
    095 000-00-00 </a>
    </div>`;

  const line = `<div style="background-color: #454545; height:3px;"></div>`;

  const header = `<div style="display: flex; justify-content: space-between;">
  <div>${logo}${greeting}</div>
  ${mobile}
  </div>
  ${line}`;

  return header;
};

exports.messageFooter = (url, logoSrc, customer) => {
  const logo = `
    <a href="${url}" target="_blank" style="padding-bottom:10px;">
    <img src="${logoSrc}" width="200" height="60" alt="logo">
    </a>`;

  const greeting = `<div style="font-size:14px;padding-bottom:15px;font-family:Arial, sans-serif;">
    Здравствуйте, ${customer.firstName} ${customer.lastName}!</div>`;

  const mobile = `<div>
    <a style="color:#000; text-decoration:none;" href="tel:+380440000000">
    044 000-00-00 </a>
    <a style="color:#000;text-decoration:none;" href="tel:+380950000000">
    095 000-00-00 </a>
    </div>`;

  const line = `<div style="background-color: #454545; height:1px;"></div>`;

  const header = `<div style="display: flex; justify-content: space-between;">
  <div>${logo}${greeting}</div>
  ${mobile}
  </div>
  ${line}`;

  return header;
};

exports.message = (req, res, next) => {
  return;
};
