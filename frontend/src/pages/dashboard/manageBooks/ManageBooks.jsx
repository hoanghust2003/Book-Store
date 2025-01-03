import React, { useEffect } from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery, useFetchBooksByCustomerQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import { useAuth } from '../../../context/AuthContext';
const ManageBooks = () => {
    const navigate = useNavigate();
   const { currentUser } = useAuth();
    const userId = currentUser?.id;

    // Fetch books
    const { data: books = [], refetch } = useFetchBooksByCustomerQuery(userId, {
        skip: !userId, // Skip the query if userId is not available
    });
    
    useEffect(() => {
        if (userId) {
            refetch();
        }
    }, [userId, refetch]);
    console.log(currentUser?.id)
    console.log("Books length",books?.length)
    const [deleteBook] = useDeleteBookMutation();
    // Handle deleting a book
    const handleDeleteBook = async (id) => {
        try {
            await deleteBook(id).unwrap();
            alert('Book deleted successfully!');
            refetch();
        } catch (error) {
            console.error('Failed to delete book:', error.message);
            alert('Failed to delete book. Please try again.');
        }
    };

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-book/${id}`);
    };
  return (
    <section className="py-1 bg-blueGray-50">
    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700"></h3>
                    </div>
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                        
                    </div>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center bg-transparent w-full border-collapse ">
                    <thead>
                        <tr>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                #
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Tên
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Thể loại
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Giá hiện tại
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            books && books.map((book, index) => (
                                <tr key={index}>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                   {index + 1}
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                    {book.title}
                                </td>
                                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  {book.category}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                                    {book.newPrice} VNĐ
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 space-x-4">

                                    <Link to={`/dashboard/edit-book/${book._id}`} className="font-medium text-indigo-600 hover:text-indigo-700 mr-2 hover:underline underline-offset-2">
                                        Edit
                                    </Link>
                                    <button 
                                    onClick={() => handleDeleteBook(book._id)}
                                    className="font-medium bg-red-500 py-1 px-4 rounded-full text-white mr-2">Delete</button>
                                </td>
                            </tr> 
                            ))
                        }
         

                    </tbody>

                </table>
            </div>
        </div>
    </div>

</section>
  )
}
// const ManageBooks = () => {
//     const navigate = useNavigate();
//    const { currentUser } = useAuth();
//     const userId = currentUser?.id;

//     // Fetch books
//     const { data: books = [], refetch } = useFetchBooksByCustomerQuery(userId, {
//         skip: !userId, // Skip the query if userId is not available
//     });
    
//     useEffect(() => {
//         if (userId) {
//             refetch();
//         }
//     }, [userId, refetch]);
//     console.log(currentUser?.id)
//     console.log("Books length",books?.length)
//     const [deleteBook] = useDeleteBookMutation();
//     // Handle deleting a book
//     const handleDeleteBook = async (id) => {
//         try {
//             await deleteBook(id).unwrap();
//             alert('Book deleted successfully!');
//             refetch();
//         } catch (error) {
//             console.error('Failed to delete book:', error.message);
//             alert('Failed to delete book. Please try again.');
//         }
//     };

//     const handleEditClick = (id) => {
//         navigate(`/dashboard/edit-book/${id}`);
//     };

   

//     return (
//         <section className="py-1 bg-blueGray-50">
//             <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
//                 <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
//                     <div className="rounded-t mb-0 px-4 py-3 border-0">
//                         <div className="flex flex-wrap items-center">
//                             <div className="relative w-full px-4 max-w-full flex-grow flex-1">
//                                 <h3 className="font-semibold text-base text-blueGray-700">All Books</h3>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="block w-full overflow-x-auto">
//                         <table className="items-center bg-transparent w-full border-collapse">
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Book Title</th>
//                                     <th>Category</th>
//                                     <th>Price</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {books?.length > 0 ? (
//                                     books.map((book, index) => (
//                                         <tr key={index}>
//                                             <td>{index + 1}</td>
//                                             <td>{book.title}</td>
//                                             <td>{book.category}</td>
//                                             <td>{book.newPrice} VNĐ</td>
//                                             <td>
//                                                 <Link to={`/dashboard/edit-book/${book._id}`}>Edit</Link>
//                                                 <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="5" className="text-center">
//                                             No books available.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

export default ManageBooks