import React from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi'
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
const OrderPage = () => {
    const { currentUser} = useAuth()
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const orderId = queryParams.get('orderId');

    React.useEffect(() => {
        if (status === 'success' && orderId) {
            Swal.fire({
                title: 'Thanh Toán Thành Công',
                text: `Đơn hàng ${orderId} đã được thanh toán thành công! Cảm ơn quý khách đã mua hàng`,
                icon: 'success',
            });
        }
    }, [status, orderId]);
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error geting orders data</div>
    return (
        <div className='container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200'>Your Orders</h2>
            {
                orders.length === 0 ? (<div>No orders found!</div>) : (<div>
                    {
                        orders.map((order, index) => (
                            <div key={order._id} className="border-b mb-4 pb-4 dark:border-gray-700">
                                <p className='p-1 bg-secondary text-white w-10 rounded mb-1'># {index + 1}</p>
                                <h2 className="font-bold">Đơn Hàng: {order._id}</h2>
                                <p className="text-gray-600 dark:text-gray-400">Tên: {order.name}</p>
                                <p className="text-gray-600 dark:text-gray-400">Email: {order.email}</p>
                                <p className="text-gray-600 dark:text-gray-400">SĐT: {order.phone}</p>
                                <p className="text-gray-600 dark:text-gray-400">Tiền phải trả: {order.totalPrice} VNĐ</p>
                                <p className="text-gray-600 dark:text-gray-400">Trạng thái thanh toán: {order.paymentStatus}</p>
                                <h3 className="font-semibold mt-2">Tỉnh/Thành phố, Quận/Huyện, Phường/Xã:</h3>
                                <p className="text-gray-600 dark:text-gray-400"> {order.address.city}, {order.address.district}, {order.address.ward}</p>
                                <h3 className="font-semibold mt-2">Tên đường, Toà nhà, Số nhà:</h3>
                                <p className="text-gray-600 dark:text-gray-400"> {order.detailAddr}</p>
                                <h3 className="font-semibold mt-2">Sản phẩm:</h3>
                                <ul>
                                    {order.productIds.map((productId) => (
                                        <li key={productId} className="text-gray-600 dark:text-gray-400">{productId}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    }
                </div>)
            }
        </div>
    )
}

export default OrderPage