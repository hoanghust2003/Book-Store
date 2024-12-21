import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../../assets/avatar.png"
const ReviewSection = ({ id, title }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        const response = await axios.get(`http://localhost:5000/api/reviews/list/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });
        console.log("Fetched reviews:", response.data); // Log the fetched reviews
        setReviews(Array.isArray(response.data) ? response.data : []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching reviews</div>;

  return (
    <div className="pb-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="mt-6 space-y-6">
        {reviews.map((review) => {
          return (
            <div key={review._id}>
              <div className="flex items-center space-x-3">
                <img
                  src={review.user.avatar?.url || defaultAvatar}
                  alt={review.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{review.user.name}</p>
                  <div className="flex items-center space-x-1">
                    <span>{review.rating}</span>
                    <FaStar />
                  </div>
                </div>
              </div>
              <div className="pl-10">
                <p dangerouslySetInnerHTML={{ __html: review.content }}></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;