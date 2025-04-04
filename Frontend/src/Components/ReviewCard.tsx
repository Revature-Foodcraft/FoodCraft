// src/Components/ReviewCard.tsx
import React from "react";
import StarRating from "./StarRating";

export interface Review {
  reviewId: string;
  reviewerName: string;
  reviewerPicture: string;
  rating: number;
  description: string;
}

export interface ReviewCardProps {
  reviewerName: string;
  reviewerPicture?: string; // Make it optional if needed
  rating: number;
  description: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  reviewerPicture,
  rating,
  description,
}) => {
  // Use the default Gravatar image if reviewerPicture is falsy
  const imageUrl = reviewerPicture && reviewerPicture.trim().length > 0 
    ? reviewerPicture 
    : "https://www.gravatar.com/avatar/?d=mp";

  return (
    <div className="review-card">
      <div className="review-card-header">
        <img
          src="https://www.gravatar.com/avatar/?d=mp"
          alt={`${reviewerName} profile`}
          className="reviewer-picture"
        />
        <div className="reviewer-info">
          <h3>{reviewerName}</h3>
          <div className="review-rating">
            <StarRating rating={rating} outOf={5} />
            <span className="numeric-rating">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="review-card-body">
        <p className="review-description">{description}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
