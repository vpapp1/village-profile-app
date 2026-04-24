import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div>
        <div className="title">
          <h3>खाँडादेवी गाउँपालिका</h3>
          <p>माकादुम, रामेछाप, बागमती प्रदेश</p>
        </div>
        <Link to="/village-profile-app/app">Household Survey</Link>
      </div>
    </div>
  );
}
