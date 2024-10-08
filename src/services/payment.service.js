const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const crypto = require('crypto');
const { env } = require('../config');

const paymentWithMoMo = async (order) => {
  var accessKey = env.momo.accessKey.toString();
  var secretKey = env.momo.secretKey.toString();
  var orderInfo = 'pay with MoMo';
  var partnerCode = env.momo.partnerCode;
  var redirectUrl = env.momo.redirectUrl;
  var ipnUrl = env.momo.ipnUrl;
  var requestType = 'payWithMethod';
  var amount = order?.totalAmount?.toString();
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = '';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';

  //   console.log('amount', amount);
  //   console.log('accessKey', accessKey);
  //   console.log('secretKey', secretKey);
  //   console.log('orderInfo', orderInfo);
  //   console.log('partnerCode', partnerCode);
  //   console.log('redirectUrl', redirectUrl);
  //   console.log('ipnUrl', ipnUrl);

  const rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;

  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const requestBody = JSON.stringify({
    partnerCode,
    partnerName: env.momo.partnerName,
    storeId: env.momo.storeId,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature,
  });

  try {
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.log('error: ', error.response.data.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi khi xử lý thanh toán.');
  }
};

module.exports = {
  paymentWithMoMo,
};
