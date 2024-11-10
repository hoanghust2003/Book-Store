import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ReviewSection = ({ id, title, reviews }) => {
  if (!reviews.length)
    return (
      <div className="pb-20">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="mt-6">
          <p className="text-xl">
            Be the first to{" "}
            <Link to={`/rate/${id}`} className="underline font-semibold">
              add a review
            </Link>
          </p>
        </div>
      </div>
    );

  return (
    <div className="pb-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="mt-6 space-y-6">
        {reviews.map((review) => {
          return (
            <div key={review.id}>
              <div className="flex items-center space-x-3">
                <img
                  src={review.user.avatar?.url}
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
                <p>{review.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;