import React from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi'
import { useAuth } from '../../context/AuthContext';

const OrderPage = () => {
    const { currentUser} = useAuth()
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);
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
                                <h2 className="font-bold">Order ID: {order._id}</h2>
                                <p className="text-gray-600 dark:text-gray-400">Name: {order.name}</p>
                                <p className="text-gray-600 dark:text-gray-400">Email: {order.email}</p>
                                <p className="text-gray-600 dark:text-gray-400">Phone: {order.phone}</p>
                                <p className="text-gray-600 dark:text-gray-400">Total Price: ${order.totalPrice}</p>
                                <p className="text-gray-600 dark:text-gray-400">Status: ${order.paymentStatus}</p>
                                <h3 className="font-semibold mt-2">Address:</h3>
                                <p className="text-gray-600 dark:text-gray-400"> {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                                <h3 className="font-semibold mt-2">Products Id:</h3>
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