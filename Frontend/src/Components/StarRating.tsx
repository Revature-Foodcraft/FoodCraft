// StarRating.tsx
import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  outOf?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, outOf = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating" style={{ display: "flex", alignItems: "center" }}>
      {Array(fullStars)
        .fill(null)
        .map((_, index) => (
          <FaStar key={`full-${index}`} color="gold" />
        ))}
      {hasHalfStar && <FaStarHalfAlt key="half" color="gold" />}
      {Array(emptyStars)
        .fill(null)
        .map((_, index) => (
          <FaRegStar key={`empty-${index}`} color="gold" />
        ))}
    </div>
  );
};

export default StarRating;
