import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { getImgUrl } from "../../utils/getImgUrl";
import { removeFromCart, clearCart } from "../../redux/features/cart/cartSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getBaseUrl from "../../utils/baseURL";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice, 0)
    .toFixed(2);
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [isChecked, setIsChecked] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");

  const handlePayment = async (newOrder) => {
    if (paymentMethod === "COD") {
      try {
        await createOrder(newOrder).unwrap();
        Swal.fire({
          title: "Order Confirmed",
          text: "Your order has been placed successfully!",
          icon: "success",
        });
        navigate("/orders");
      } catch (error) {
        console.error("Error placing order", error);
         toast.error("Failed to place order");
      }
    } else if (paymentMethod === "VNPAY") {
      try {
        console.log("Order ID:", newOrder._id);
        const { data } = await axios.post(
          `${getBaseUrl}/api/orders/create_payment_url`,
          { orderId: newOrder._id, bankCode: "NCB", language: "vn" }
        );
        window.location.href = data.url; // Redirect to VNPay payment page
      } catch (error) {
        console.error("Error creating VNPay payment URL", error);
        toast.success("Failed to initiate VNPay payment");
      }
    }
  };

  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: selectedProvinceName,
        district: selectedDistrictName,
        ward: selectedWardName,
        country: data.country,
        state: data.state,
        zipCode: data.zipcode,
      },
      phone: data.phone,
      productIds: cartItems.map((item) => item?._id),
      totalPrice: totalPrice,
    };

    try {
      const response = await createOrder(newOrder).unwrap();
      await handlePayment(response); // Xử lý theo phương thức thanh toán
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  // Fetch danh sách tỉnh/thành phố khi component được render
  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=1"
      );
      setProvinces(response.data);
    };
    fetchProvinces();
  }, []);

  // Fetch danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
        );
        setDistricts(response.data.districts);
        setWards([]); // Reset wards khi tỉnh/thành phố thay đổi
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Fetch danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        );
        setWards(response.data.wards);
      }
    };
    fetchWards();
  }, [selectedDistrict]);
  if (isLoading) return <div>Loading....</div>;

  return (
    <form
                onSubmit={handleSubmit(onSubmit)}
                
              >
    <section>
      
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-8 mb-6">
              
                {/* Header */}
                <div className="lg:col-span-2 text-gray-600 dark:text-gray-300 mb-4">
                  <p className="font-bold text-lg">ĐỊA CHỈ GIAO HÀNG</p>
                  <hr className="my-4 border-gray-300 dark:border-gray-600" />
                </div>

                {/* Họ và tên */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="name"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Họ và tên người nhận
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    id="name"
                    placeholder="Nhập họ và tên người nhận"
                    className="flex-1 h-10 border rounded px-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>

                {/* Email */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="email"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Địa chỉ Email
                  </label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    id="email"
                    defaultValue={currentUser?.email}
                    placeholder="Nhập email"
                    className="flex-1 h-10 border rounded px-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="phone"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Số điện thoại
                  </label>
                  <input
                    {...register("phone", { required: true })}
                    type="tel"
                    id="phone"
                    placeholder="Ví dụ: 0979123xxx (10 ký tự số)"
                    className="flex-1 h-10 border rounded px-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>

                {/* Quốc gia */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="country"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Quốc gia
                  </label>
                  <input
                    disabled
                    defaultValue="Việt Nam"
                    className="flex-1 h-10 border rounded px-4 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  />
                </div>

                {/* Tỉnh/Thành phố */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="city"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Tỉnh/Thành phố
                  </label>
                  <select
                    {...register("city", { required: true })}
                    className="flex-1 h-10 border rounded px-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      setSelectedProvince(e.target.value);
                      setSelectedProvinceName(selectedOption.text);
                    }}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quận/Huyện */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="district"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Quận/Huyện
                  </label>
                  <select
                    {...register("district", { required: true })}
                    className="flex-1 h-10 border rounded px-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      setSelectedDistrict(e.target.value);
                      setSelectedDistrictName(selectedOption.text);
                    }}
                    disabled={!districts.length}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phường/Xã */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="ward"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Phường/Xã
                  </label>
                  <select
                    {...register("ward", { required: true })}
                    className="flex-1 h-10 border rounded px-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      setSelectedWard(e.target.value);
                      setSelectedWardName(selectedOption.text);
                    }}
                    disabled={!wards.length}
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Địa chỉ nhận hàng */}
                <div className="lg:col-span-2 flex items-center">
                  <label
                    htmlFor="address"
                    className="w-1/3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    Địa chỉ nhận hàng
                  </label>
                  <input
                    {...register("address", { required: true })}
                    type="text"
                    id="address"
                    placeholder="Nhập địa chỉ nhận hàng"
                    className="flex-1 h-10 border rounded px-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              
            </div>

            <div className=" bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <div className="container max-w-screen-lg mx-auto">
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-8 mb-6">
                    <FormControl>
                      <div className="lg:col-span-2 text-gray-600 dark:text-gray-300 mb-4">
                        <p className="font-bold text-lg">
                          PHƯƠNG THỨC THANH TOÁN
                        </p>
                        <hr className="my-4 border-gray-300 dark:border-gray-600" />
                      </div>
                      {/* <FormLabel id="font-bold demo-radio-buttons-group-label">PHƯƠNG THỨC THANH TOÁN</FormLabel> */}
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={paymentMethod}
                        name="radio-buttons-group"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <FormControlLabel
                          value="VNPAY"
                          control={<Radio />}
                          label={
                            <div className="flex items-center">
                              <img
                                src="https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_vnpay.svg?q=10755"
                                alt="VNPay"
                                className="ml-2 mr-2"
                                style={{ width: "50px", height: "auto" }}
                              />
                              <span> VNPAY</span>
                            </div>
                          }
                        />
                        <FormControlLabel
                          value="COD"
                          control={<Radio />}
                          label={
                            <div className="flex items-center">
                              <img
                                src="https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_zalopaycc.svg?q=10755"
                                alt="COD"
                                className="ml-2 mr-2"
                                style={{ width: "50px", height: "auto" }}
                              />
                              <span> TRẢ KHI NHẬN HÀNG</span>
                            </div>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <div className="container max-w-screen-lg mx-auto">
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-8 mb-6">
                    <p className="font-bold text-lg">KIỂM TRA LẠI ĐƠN HÀNG</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Tổng Số Tiền: {totalPrice} VND
                    </p>

                    <hr className="my-4 border-gray-300 dark:border-gray-600" />
                    <div className="mt-8">
                      <div className="flow-root">
                        {cartItems.length > 0 ? (
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200 dark:divide-gray-700"
                          >
                            {cartItems.map((product) => (
                              <li key={product?._id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                  <img
                                    alt=""
                                    src={`${getImgUrl(product?.coverImage)}`}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex flex-wrap justify-between text-base font-medium text-gray-900 dark:text-gray-200">
                                      <h3>
                                        <Link to="/">{product?.title}</Link>
                                      </h3>
                                      <p className="sm:ml-4">
                                        ${product?.newPrice}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                                      <strong>Thể loại:</strong>{" "}
                                      {product?.category}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                                    <p className="text-gray-500 dark:text-gray-400">
                                      <strong>Sl:</strong> 1
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            No product found!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <div className="container max-w-screen-lg mx-auto">
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-8 mb-6">
                    <div className="md:col-span-5 mt-3">
                      <div className="inline-flex items-center">
                        <input
                          onChange={(e) => setIsChecked(e.target.checked)}
                          type="checkbox"
                          name="billing_same"
                          id="billing_same"
                          className="form-checkbox"
                        />
                        <label
                          htmlFor="billing_same"
                          className="ml-2 text-gray-600 dark:text-gray-300"
                        >
                          Bằng việc tiến hành Mua hàng. Bạn đã đồng ý với{" "}
                          <Link className="underline underline-offset-2 text-blue-600 dark:text-blue-400">
                            Điều khoản
                          </Link>{" "}
                          và{" "}
                          <Link className="underline underline-offset-2 text-blue-600 dark:text-blue-400">
                            Điều kiện của chúng tôi.
                          </Link>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                   
                    <div className="lg:col-span-2 text-right mt-4">
                      <button
                          type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Xác nhận thanh toán
                      </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
    </form>
  );
};

export default CheckoutPage;
