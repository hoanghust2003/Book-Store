import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import RichEditor from '../../components/richeditor';
import '../../App.css';
import '../../index.css'

const ReviewForm = () => {
  const { bookId } = useParams();
  const [content, setContent] = useState("")
  const [selectedRatings, setSelectedRatings] = useState([]);

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
      await client.post("/review", {
        bookId,
        rating: selectedRatings.length,
        content,
      });

      toast.success("Thanks for leaving a rating.");
    } catch (error) {
      parseError(error);
    } finally {
      setLoading(false);
    }
  };

  const ratings = Array(5).fill("");

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-6">
      {/* Rating bar */}
      {ratings.map((_, index) => {
        return (
          <Button
            isIconOnly
            color="warning"
            variant="light"
            radius="full"
            key={index}
            onClick={() => updateRatingChanges(index + 1)}
          >
            <FaStar
              size={24}
              className={`star-icon ${selectedRatings[index] === "selected" ? "selected" : ""}`}
            />
          </Button>
        );
      })}

      {/* Editor */}
      <RichEditor value={content} onChange={setContent} placeholder="Write about book..." />

      {/* Submit Button */}
      <Button type="submit"
      className="submit-review-btn"
      >Submit Review</Button>
    </form>
  );
};

export default ReviewForm;