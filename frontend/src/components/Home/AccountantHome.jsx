import { useState } from "react";
import "./accountant_home.css";
import { toast } from "react-hot-toast";

export default function AccountantHome() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [day, setDay] = useState("monday");
  const [meal, setMeal] = useState("breakfast");

  const [menuData, setMenuData] = useState({
    main: [""],
    extras: [{ name: "", price: "" }],
  });

  // Add / Remove handlers
  const addMainItem = () =>
    setMenuData({ ...menuData, main: [...menuData.main, ""] });

  const removeMainItem = (i) => {
    const updated = [...menuData.main];
    updated.splice(i, 1);
    setMenuData({ ...menuData, main: updated });
  };

  const addExtraItem = () =>
    setMenuData({
      ...menuData,
      extras: [...menuData.extras, { name: "", price: "" }],
    });

  const removeExtraItem = (i) => {
    const updated = [...menuData.extras];
    updated.splice(i, 1);
    setMenuData({ ...menuData, extras: updated });
  };

  // Handle input changes
  const handleMainChange = (i, val) => {
    const updated = [...menuData.main];
    updated[i] = val;
    setMenuData({ ...menuData, main: updated });
  };

  const handleExtraChange = (i, field, val) => {
    const updated = [...menuData.extras];
    updated[i][field] = val;
    setMenuData({ ...menuData, extras: updated });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (menuData.main.some((m) => m.trim() === "")) {
      toast.error("Please fill all main items or remove empty ones.");
      return;
    }

    if (
      menuData.extras.some(
        (ex) => ex.name.trim() === "" || ex.price === "" || isNaN(ex.price)
      )
    ) {
      toast.error("Please fill valid extras with names and prices.");
      return;
    }

    // const dataToSend = {
    //   date,
    //   day,
    //   [meal]: {
    //     main: menuData.main,
    //     extras: menuData.extras.map((ex) => ({
    //       name: ex.name,
    //       price: Number(ex.price),
    //     })),
    //   },
    // };

    try {
      //$$handle api
      // const res = await fetch("/api/menu/update", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(dataToSend),
      // });

      // if (res.ok) {
      //   toast.success(`Menu for ${meal} updated successfully!`);
      //   setMenuData({ main: [""], extras: [{ name: "", price: "" }] });
      // } else toast.error("Failed to update menu!");
      toast.success(`Menu for ${meal} updated successfully!`);
      setMenuData({ main: [""], extras: [{ name: "", price: "" }] });
    } catch (err) {
      console.error(err);
      toast.error("Error updating menu!");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  return (
    <div className="accountant-home-container">
      <header className="accountant-header">
        <h1>
          <i className="fas fa-clipboard-list"></i> Update Mess Menu
        </h1>
        <p>Manage daily meals and extras efficiently</p>
        <button onClick={handleLogout} className="acc-logout-btn">
          Logout
        </button>

        <div className="selectors">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Day:</label>
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {[
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ].map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>

          <label>Meal:</label>
          <select value={meal} onChange={(e) => setMeal(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </header>

      <form className="accountant-form" onSubmit={handleSubmit}>
        <div className="menu-card">
          <h2>
            <i className="fas fa-utensils"></i> Main Items
          </h2>
          {menuData.main.map((item, i) => (
            <div key={i} className="item-row">
              <input
                type="text"
                placeholder="Enter main item"
                value={item}
                onChange={(e) => handleMainChange(i, e.target.value)}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeMainItem(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addMainItem}>
            + Add Main Item
          </button>
        </div>

        <div className="menu-card">
          <h2>
            <i className="fas fa-plus-circle"></i> Extra Items
          </h2>
          {menuData.extras.map((extra, i) => (
            <div key={i} className="item-row">
              <input
                type="text"
                placeholder="Extra item name"
                value={extra.name}
                onChange={(e) => handleExtraChange(i, "name", e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={extra.price}
                onChange={(e) => handleExtraChange(i, "price", e.target.value)}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeExtraItem(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addExtraItem}>
            + Add Extra
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Submit Menu
        </button>
      </form>
    </div>
  );
}
