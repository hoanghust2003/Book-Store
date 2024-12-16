import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams, Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import ReviewSection from "./ReviewSection";
import RecommendSection from "./RecommendSection";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { useGetPublicReviewsQuery } from "../../redux/features/reviews/reviewsApi";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ReviewForm from "./ReviewForm";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const { data: reviews = [], refetch } = useGetPublicReviewsQuery(id);
  const dispatch = useDispatch();
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [value, setValue] = React.useState('details');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${id}`);

        // Kiểm tra nếu response không hợp lệ
        if (!response.ok) {
          console.error(`Failed to fetch reviews: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setReviews(data.reviews || []); // Đảm bảo `data.reviews` tồn tại
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleReviewSubmit = () => {
    refetch(); // Refresh reviews after submitting
    setShowReviewForm(false); // Close the form
  };
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN'); // Định dạng giá theo kiểu Việt Nam
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !book)
    return <div>Error happened while loading book info</div>;

  return (
    <div className="font-roboto bg-gray-50 dark:bg-gray-900 py-10 max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            to="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            to="/books"
          >
            <LocalLibraryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Books
          </Link>
          <Typography
            sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
          >
            <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {book?.title}
          </Typography>
        </Breadcrumbs>
      </div>

      <div className="max-w-10xl mx-auto shadow-md p-5 bg-white dark:bg-gray-800 flex">
        <div className="sticky top-20 w-full md:w-1/3">
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            className="w-full h-auto mb-8"
          />
          <button
            onClick={() => handleAddToCart(book)}
            className="bg-blue-600 text-white px-6 py-3 flex items-center gap-2 w-full lg:w-auto mt-4 rounded-lg border border-gray-300"
          >
            <FiShoppingCart className="text-lg" />
            <span>Thêm vào giỏ hàng</span>
          </button>
          <ul className="mt-4 text-sm text-gray-600 space-y-2">
            <li>🚚 <strong>Giao hàng:</strong> Nhanh và uy tín</li>
            <li>🔄 <strong>Đổi trả:</strong> Miễn phí toàn quốc</li>
            <li>🎁 <strong>Ưu đãi:</strong> Giảm giá cho số lượng lớn</li>
          </ul>
          
        </div>

        <div className="md:w-2/3 md:pl-8">
        <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Tác giả:</strong> {book.author || "admin"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Ngày xuất bản:</strong>{" "}
              {new Date(book?.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 capitalize">
              <strong>Thể loại:</strong> {book?.category}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Tóm tắt nội dung:</strong> {book.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-lg text-red-500 font-bold">
                {formatPrice(book.newPrice)} VND
              </div>
              {
                <div className="text-sm text-gray-500 line-through dark:text-gray-400">
                  {formatPrice(book.oldPrice)} VND
                </div>
              }
            </div>
          </div>
          <Box sx={{ width: '100%', mt: 10 }}>
            <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
              <Tab value="more details" label="Thông tin chi tiết" />
              <Tab value="details" label="Mô tả sản phẩm" />
              <Tab value="reviews" label={`Đánh giá (${reviews.length})`} />
            </Tabs>
          </Box>
          {value === 'more details' && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Thông tin chi tiết</h2>
              <div className="grid grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
                <div className="font-semibold">Mã hàng:</div>
                <div className="col-span-2">{book.sku || "8935235226272"}</div>

                <div className="font-semibold">Tác giả:</div>
                <div className="col-span-2">{book.author || "Paulo Coelho"}</div>

                <div className="font-semibold">Nhà cung cấp:</div>
                <div className="col-span-2">{book.publisher || "Nhà Nam"}</div>

                <div className="font-semibold">Ngày xuất bản:</div>
                <div className="col-span-2">{new Date(book.createdAt).toLocaleDateString()}</div>

                <div className="font-semibold">Kích thước:</div>
                <div className="col-span-2">{book.size || "20.5 x 13 cm"}</div>

                <div className="font-semibold">Trọng lượng:</div>
                <div className="col-span-2">{book.weight || "220 g"}</div>

                <div className="font-semibold">Số trang:</div>
                <div className="col-span-2">{book.pages || "227"}</div>

                <div className="font-semibold">Hình thức:</div>
                <div className="col-span-2">{book.format || "Bìa mềm"}</div>
              </div>
            </div>
          )}


          {value === 'details' && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6"></h2>
              {book.longDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300 mb-4">{paragraph}</p>
              ))}
            </div>
          )}

          {value === 'reviews' && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Đánh giá</h2>
              <ReviewForm bookId={id} onSubmitSuccess={handleReviewSubmit} />
              {/* <ReviewSection id={book?._id} title="Reviews" reviews={reviews} /> */}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <RecommendSection category={book?.category} />
      </div>
    </div>
  );
};

export default SingleBook;