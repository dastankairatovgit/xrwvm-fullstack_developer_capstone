import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import Header from '../Header/Header';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  let dealer_url = "/djangoapp/get_dealers";

  const filterDealers = async (state) => {
    const url = state === "All" ? dealer_url : dealer_url + "/" + state;
    const res = await fetch(url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealersList(Array.from(retobj.dealers));
    }
  };

  const get_dealers = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers);
      let st = [];
      all_dealers.forEach((dealer) => { st.push(dealer.state); });
      setStates(Array.from(new Set(st)).sort());
      setDealersList(all_dealers);
    }
  };

  useEffect(() => {
    get_dealers();
    // eslint-disable-next-line
  }, []);

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" defaultValue="" onChange={(e) => filterDealers(e.target.value)}>
                <option value="" disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map((state) => (<option key={state} value={state}>{state}</option>))}
              </select>
            </th>
            {isLoggedIn ? <th>Review Dealer</th> : <></>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map((dealer) => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td><a href={'/dealer/' + dealer.id}>{dealer.full_name}</a></td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn ? (
                <td><a className="review_link" href={`/postreview/${dealer.id}`}>Review Dealer</a></td>
              ) : <></>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
