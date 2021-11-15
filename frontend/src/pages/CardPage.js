import React from "react";
import NavHome from "../components/NavHome";
import Deactivate from "../components/Deactivate";
import Profile from "../components/Profile";

const CardPage = () => {
  return (
    <div>
      <NavHome />
      <br />
      <Profile />
      <Deactivate />
    </div>
  );
};

export default CardPage;
