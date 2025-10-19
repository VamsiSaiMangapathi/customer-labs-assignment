import React, { useState } from "react";
import SegmentBuilder from "./components/segments/SegmentPage";
import "./App.css";
import HeaderPage from "./components/header/Header";

function App() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <HeaderPage title="View Audience" />
      <button
        className="px-4 py-2 bg-transparent border-2 border-gray-300 mt-[5%] ml-[5%] text-[#61dafb] text-lg cursor-pointer"
        onClick={() => {
          setShowPopup(true);
        }}
      >
        Save segment
      </button>
      {showPopup && (
        <SegmentBuilder
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
