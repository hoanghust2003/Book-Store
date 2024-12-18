const Order = require('./order.model');
const querystring = require('qs');
const crypto = require('crypto');

const vnpayConfig = {
  vnp_TmnCode: process.env.VN_PAY_TMNCODE,
  vnp_HashSecret: process.env.VN_PAY_HASHSECRET,
  vnp_Url: process.env.VN_PAY_URL,
  vnp_ReturnUrl: process.env.VN_PAY_RETURN_URL , // URL callback sau khi thanh toán
};

const createAOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error('Error creating order', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Tạo URL thanh toán VNPay
const createPaymentUrl = async (req, res) => {
  const { orderId } = req.body;
  
  try {
    console.log(orderId)
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(order)
    const tmnCode = vnpayConfig.vnp_TmnCode;
    const secretKey = vnpayConfig.vnp_HashSecret;
    const vnpUrl = vnpayConfig.vnp_Url;

    const date = new Date();
    const createDate = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${(
      '0' + date.getDate()
    ).slice(-2)}${('0' + date.getHours()).slice(-2)}${('0' + date.getMinutes()).slice(-2)}${(
      '0' + date.getSeconds()
    ).slice(-2)}`;

    const orderInfo = `Thanh toan don hang ${order._id}`;
    const amount = order.totalPrice * 100;
    const orderIdVNPay = order._id.toString();

    // Lấy địa chỉ IP hợp lệ
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount,
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: req.ip,
      vnp_Locale: 'vn',
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_TxnRef: orderIdVNPay,
    };

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params.vnp_SecureHash = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;
    console.log(paymentUrl)
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('Error creating payment URL', error);
    res.status(500).json({ message: 'Failed to create payment URL' });
  }
};

// Xử lý callback khi VNPay trả về
const handlePaymentReturn = async (req, res) => {
  let vnp_Params = req.body;
  //console.log("Received vnp_Params:", vnp_Params);

  const secureHash = vnp_Params['vnp_SecureHash'];
  console.log('SecureHash từ VNPay:', secureHash);
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const secretKey = vnpayConfig.vnp_HashSecret;
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  if (secureHash === signed) {
    const orderId = vnp_Params['vnp_TxnRef'];
    const order = await Order.findById(orderId);
    console.log("signed==hash")
    if (order) {
      //console.log(order)
      const responseCode = vnp_Params['vnp_ResponseCode'];
      console.log('VNPay Response Code:', responseCode);
      order.paymentStatus = vnp_Params['vnp_ResponseCode'] === '00' ? 'Paid' : 'Failed';
      //console.log(vnp_Params['vnp_ResponseCode'])
      order.paymentInfo = {
        transactionId: vnp_Params['vnp_TransactionNo'],
        vnpResponseCode: vnp_Params['vnp_ResponseCode'],
        bankCode: vnp_Params['vnp_BankCode'],
        paymentDate: vnp_Params['vnp_PayDate'],
      };
      //console.log(order.paymentInfo)
      await order.save();
      return res.status(200).json({ message: 'Payment success', order });
    }
  }

  console.log('SecureHash từ VNPay:', secureHash);
  console.log('SecureHash tính lại:', signed);

  res.status(400).json({ message: 'Invalid signature' });
};

// Helper function
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

module.exports = {
  createAOrder,
  getOrderByEmail,
  createPaymentUrl,
  handlePaymentReturn,
};
