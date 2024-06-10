import React from "react";

const Error401 = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Server nije dostupan, provjeri server.</h1>
      </div>
    </div>
  );
};

export default Error401;