import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let params = useParams();
  let id = params.id;
  let dealer_url = `/djangoapp/dealer/${id}`;
  let review_url = `/djangoapp/add_review`;
  let carmodels_url = `/djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }
    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" ");

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": parseInt(id),
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": parseInt(year),
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsoninput,
    });
    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    } else {
      alert("Could not post review. Please log in again.");
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) setDealer(dealerobjs[0]);
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, { method: "GET" });
    const retobj = await res.json();
    setCarmodels(Array.from(retobj.CarModels));
  };

  useEffect(() => {
    get_dealer();
    get_cars();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Header />
      <div className="postreview_form">
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <label>Review</label>
        <textarea id="review" cols="50" rows="7" onChange={(e) => setReview(e.target.value)}></textarea>

        <label>Purchase Date</label>
        <input type="date" onChange={(e) => setDate(e.target.value)} />

        <label>Car Make and Model</label>
        <select name="cars" id="cars" defaultValue="" onChange={(e) => setModel(e.target.value)}>
          <option value="" disabled hidden>Choose Car Make and Model</option>
          {carmodels.map((carmodel, i) => (
            <option key={i} value={carmodel.CarMake + " " + carmodel.CarModel}>
              {carmodel.CarMake} {carmodel.CarModel}
            </option>
          ))}
        </select>

        <label>Car Year</label>
        <input type="number" onChange={(e) => setYear(e.target.value)} max={2023} min={2015} />

        <button className="post_review_btn" style={{ border: "none" }} onClick={postreview}>Post Review</button>
      </div>
    </div>
  );
};

export default PostReview;
