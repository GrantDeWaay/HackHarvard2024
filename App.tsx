import React, { useEffect, useState } from "react";
import "./App.css";
import AudioRecorder from "./components/AudioRecorder";
import CheckoutList from "./components/CheckoutList";
import Header from "./components/Header";
import StateButton from "./components/StateButton";

function App() {
  const [menuItems, setMenuItems] = useState<string[]>([]);
  const handleMenuItemsChange = (newMenuItems: string[]) => {
    setMenuItems(newMenuItems);
  };

  useEffect(() => {
    const clearMenu = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/clear", {
          method: "GET",
        });
        if (response.ok) {
          console.log("Menu cleared successfully");
          // Handle the response if necessary
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
      <img src={"./HarvardBurger.png"}></img>
      <AudioRecorder onMenuItemsChange={handleMenuItemsChange} />
      <CheckoutList items={menuItems} />
      <StateButton state={"start"}/>
    </div>
  );
}

export default App;
