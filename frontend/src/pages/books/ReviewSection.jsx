import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const ReviewSection = ({ id, title }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/list/${id}`);
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  return (
    <div className="pb-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="mt-6 space-y-6">
        {reviews.map((review) => {
          return (
            <div key={review.id}>
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
                <p dangerouslySetInnerHTML={{ __html: review.content }}>{console.log(review.content)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;