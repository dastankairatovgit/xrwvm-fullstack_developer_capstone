import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);

  let params = useParams();
  let id = params.id;
  let dealer_url = `/djangoapp/dealer/${id}`;
  let reviews_url = `/djangoapp/reviews/dealer/${id}`;

  const get_dealer = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) setDealer(dealerobjs[0]);
    }
  };

  const get_reviews = async () => {
    const res = await fetch(reviews_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      if (retobj.reviews.length > 0) {
        setReviews(retobj.reviews);
      } else {
        setUnreviewed(true);
      }
    }
  };

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return "😊";
    if (sentiment === "negative") return "😞";
    return "😐";
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    // eslint-disable-next-line
  }, []);

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {isLoggedIn ? <a className="post_review_btn" href={`/postreview/${id}`}>Post Review</a> : <></>}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <p>Loading Reviews....</p>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div className="review_panel" key={review.id}>
              <div className="senti_icon">{senti_icon(review.sentiment)}</div>
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
