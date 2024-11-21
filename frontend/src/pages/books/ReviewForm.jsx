import React, { useState } from 'react';
import { FaRegStar,FaStar } from 'react-icons/fa6';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import RichEditor from '../../components/richeditor';
import toast from "react-hot-toast";
import { useAddReviewMutation } from '../../redux/features/reviews/reviewsApi';
import '../../App.css';
import '../../index.css'

const ReviewForm = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("")
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addReview] = useAddReviewMutation();

  const updateRatingChanges = (rating) => {
    const newRatings = Array(5).fill("");
    for (let i = 0; i < rating; i++) {
      newRatings[i] = "selected";
    }
    setSelectedRatings(newRatings);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!selectedRatings.length)
     return toast.error("Please select some rating!");

    try {
      setLoading(true);
      await addReview({
        bookId,
        rating: selectedRatings.length,
        content,
      }).unwrap();
      
      toast.success("Thanks for leaving a rating.");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to submit review.")
    } finally {
      setLoading(false);
    }
  };

  const ratings = Array(5).fill("");

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-6">
      {/* Rating bar */}
      {ratings.map((_, index) => (
        <Button
          isIconOnly
          color="warning"
          variant="light"
          radius="full"
          key={index}
          onClick={() => updateRatingChanges(index + 1)}
        >
          {selectedRatings[index] === "selected" ? (
            <FaStar size={24} />
          ) : (
            <FaRegStar size={24} />
          )}
        </Button>
      ))}

      {/* Editor */}
      <RichEditor value={content} onChange={setContent} placeholder="Write about book..." />

      {/* Submit Button */}
      <Button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;