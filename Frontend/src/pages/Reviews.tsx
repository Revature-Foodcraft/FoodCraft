// src/Pages/Reviews.tsx
import React, { useEffect, useState } from "react";
import ReviewCard, { Review } from "../Components/ReviewCard";
import "../css/Reviews.css";

const dummyReviews: Review[] = [
  {
    reviewId: "1",
    reviewerName: "Alice Johnson",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Alice",
    rating: 5.0,
    description: "I loved the flavors and the presentation was perfect.",
  },
  {
    reviewId: "2",
    reviewerName: "Bob Smith",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Bob",
    rating: 4.0,
    description: "The dish was tasty but a bit too spicy for my taste.",
  },
  {
    reviewId: "3",
    reviewerName: "Clara Lee",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Clara",
    rating: 5.0,
    description: "The combination of ingredients was spot on.",
  },
  {
    reviewId: "4",
    reviewerName: "David Kim",
    reviewerPicture: "https://via.placeholder.com/150.png?text=David",
    rating: 3.5,
    description: "It was enjoyable, though I’ve had better.",
  },
  {
    reviewId: "5",
    reviewerName: "Ella Martinez",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Ella",
    rating: 5.0,
    description: "The taste was exquisite and the texture perfect.",
  },
  {
    reviewId: "6",
    reviewerName: "Frank Wright",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Frank",
    rating: 2.0,
    description: "I think a little the dish was not cooked properly.",
  },
  {
    reviewId: "7",
    reviewerName: "Grace Tan",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Grace",
    rating: 5.0,
    description: "Every bite was a delight. Highly recommend!",
  },
  {
    reviewId: "8",
    reviewerName: "Henry Zhao",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Henry",
    rating: 4.0,
    description: "Overall, a good experience, but room for improvement.",
  },
  {
    reviewId: "9",
    reviewerName: "Isabella Cruz",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Isabella",
    rating: 5.0,
    description: "I keep coming back to this recipe—it never disappoints.",
  },
  {
    reviewId: "10",
    reviewerName: "Alice Johnson",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Alice",
    rating: 5.0,
    description: "I loved the flavors and the presentation was perfect.",
  },
  {
    reviewId: "11",
    reviewerName: "Isabella Cruz",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Isabella",
    rating: 5.0,
    description: "I keep coming back to this recipe—it never disappoints.",
  },
  {
    reviewId: "12",
    reviewerName: "Bob Smith",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Bob",
    rating: 4.0,
    description: "The dish was tasty but a bit too spicy for my taste.",
  },
  {
    reviewId: "13",
    reviewerName: "Clara Lee",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Clara",
    rating: 5.0,
    description: "The combination of ingredients was spot on.",
  },
  {
    reviewId: "14",
    reviewerName: "David Kim",
    reviewerPicture: "https://via.placeholder.com/150.png?text=David",
    rating: 3.5,
    description: "It was enjoyable, though I’ve had better.",
  },
  {
    reviewId: "15",
    reviewerName: "Ella Martinez",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Ella",
    rating: 5.0,
    description: "The taste was exquisite and the texture perfect.",
  },
  {
    reviewId: "16",
    reviewerName: "Frank Wright",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Frank",
    rating: 4.0,
    description: "I think a little less salt would make it even better.",
  },
  {
    reviewId: "17",
    reviewerName: "Grace Tan",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Grace",
    rating: 5.0,
    description: "Every bite was a delight. Highly recommend!",
  },
  {
    reviewId: "18",
    reviewerName: "Henry Zhao",
    reviewerPicture: "https://via.placeholder.com/150.png?text=Henry",
    rating: 4.0,
    description: "Overall, a good experience, but room for improvement.",
  }
];


const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15; // Display up to 9 review cards per page (3 columns x 3 rows)

  const [sortOrder, setSortOrder] = useState<string>('none');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const sortedReviews =
    sortOrder === 'none'
      ? reviews
      : [...reviews].sort((a, b) =>
        sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating
      );

  useEffect(() => {
    // Simulate an API call delay
    setTimeout(() => {
      setReviews(dummyReviews);
    }, 500);
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Pagination calculations
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="reviews-page">
      <h2>Reviews</h2>
      <div>
        <label>Sort </label>
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="none">Default Order</option>
          <option value="desc">Highest Rating</option>
          <option value="asc">Lowest Rating</option>
        </select>
      </div>
      <div className="review-cards-container">
        {currentReviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            reviewerName={review.reviewerName}
            reviewerPicture={review.reviewerPicture}
            rating={review.rating}
            description={review.description}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
