import React, { useEffect, useState } from "react";
import "./App.css";
import AudioRecorder from "./components/AudioRecorder";
import CheckoutList from "./components/CheckoutList";
import Header from "./components/Header";
import StateButton from "./components/StateButton";
import menu from "./HarvardBurger.png";

function App() {
  const [menuItems, setMenuItems] = useState<string[]>([]);

  const handleMenuItemsChange = (newMenuItems: string[]) => {
    setMenuItems(newMenuItems);
  };

  useEffect(() => {
    const clearMenu = async () => {
      try {
        const response = await fetch("/clear", {
          method: "GET",
        });
        if (response.ok) {
          console.log("Menu cleared successfully");
        } else {
          console.error("Failed to clear menu", response.status);
        }
      } catch (error) {
        console.error("Error occurred while clearing menu", error);
      }
    };

    clearMenu();
  }, []);

  return (
    <div className="App">
      <Header />
      <AudioRecorder onMenuItemsChange={handleMenuItemsChange} />
      <div className="rowC">
        <div className="blackblack">
          <img src={menu} alt="Logo" className="menu" />
          <CheckoutList items={menuItems} />
        </div>
      </div>
    </div>
  );
}

export default App;
