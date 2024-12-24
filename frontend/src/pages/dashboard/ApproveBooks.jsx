import React from 'react';
import { useFetchAllBooksQuery, useApproveBookMutation, useFetchPendingBooksQuery } from '../../redux/features/books/booksApi';
import Swal from 'sweetalert2';

const ApproveBooks = () => {
  const { data: books = [], refetch } = useFetchPendingBooksQuery();
  const [approveBook] = useApproveBookMutation();
  console.log('Books data:', books);
  const handleApproveBook = async (id) => {
    try {
      await approveBook(id).unwrap();
      Swal.fire({
        title: "Book Approved",
        text: "The book has been approved successfully!",
        icon: "success",
      });
      refetch();
    } catch (error) {
      console.error('Failed to approve book:', error.message);
      Swal.fire({
        title: "Failed to Approve Book",
        text: "Please try again.",
        icon: "error",
      });
    }
  };

  const pendingBooks = books.filter(book => book.approved === 0);

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Sách Cần Phê Duyệt</h2>
      {pendingBooks.length === 0 ? (
        <div>No pending books found!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tên</th>
                <th className="py-2 px-4 border-b">Thể loại</th>
                <th className="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {pendingBooks.map((book) => (
                <tr key={book._id}>
                  <td className="py-2 px-4 border-b">{book.title}</td>
                  <td className="py-2 px-4 border-b">{book.category}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleApproveBook(book._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApproveBooks;