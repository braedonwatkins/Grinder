import React from "react";
import NavHome from "../components/NavHome";
import Logged from "../components/LoggedInName";
import Deactivate from "../components/Deactivate";

const CardPage = () => {
  return (
    <div>
      <NavHome />
      <br />
      <Logged />
      <Deactivate />
    </div>
  );
};

export default CardPage;
