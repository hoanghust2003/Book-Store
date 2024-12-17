import React, { useState, useEffect } from 'react';
import { FaRegStar,FaStar } from 'react-icons/fa6';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import RichEditor from '../../components/richeditor';
import toast from "react-hot-toast";
import client from "../../api/client";
import { useAddReviewMutation } from '../../redux/features/reviews/reviewsApi';
import '../../App.css';
import '../../index.css'

const ReviewForm = ({ bookId, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("")
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addReview] = useAddReviewMutation();
  const [fetching, setFetching] = useState(true);

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

    if (!content.trim())  // Kiểm tra content không được rỗng
    return toast.error("Please write something in the review!");
    
    try {
      setLoading(true);
      await addReview({
        bookId,
        rating: selectedRatings.length,
        content: content.trim(),
      }).unwrap();

      toast.success("Thanks for leaving a rating.");
      navigate(`/books/${bookId}`);
    } catch (error) {
      parseError(error);
    } finally {
      setLoading(false);
    }
  };

  const ratings = Array(5).fill("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data } = await client.get(`/review/${bookId}`);
        setContent(data.content || "");
        updateRatingChanges(data.rating);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) return;
          parseError(error);
        }
      } finally {
        setFetching(false);
      }
    };

    fetchReview();
  }, [bookId]);

  if (fetching)
    return (
      <div className="text-center p-5">
        <p>Please wait...</p>
      </div>
    );

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
      <Button type="submit" className="bg-blue-600 text-white px-6 py-3 flex items-center gap-2 w-full lg:w-auto mt-4" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;