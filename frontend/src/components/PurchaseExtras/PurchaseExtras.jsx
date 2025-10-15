import { useEffect, useState } from "react";
import "./purchase_extras.css";
import { toast } from "react-hot-toast";
import Navbar from "../Navbar/Navbar";

export default function PurchaseExtras() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [extrasMenu, setExtrasMenu] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const [itemsData, setItemsData] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  }); // name, price, qty

  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch extras menu when selectedDate changes
  useEffect(() => {
    async function fetchExtras() {
      try {
        //$$ Simulate fetching data (replace with API)
        const mockData = {
          breakfast: [
            { name: "Extra Milk", price: 15 },
            { name: "Peanut Chutney", price: 10 },
            { name: "Lemon Pickle", price: 5 },
          ],
          lunch: [
            { name: "Papad", price: 8 },
            { name: "Sweet Lassi", price: 20 },
            { name: "Extra Paneer", price: 25 },
          ],
          dinner: [
            { name: "Ice Cream", price: 25 },
            { name: "Fruit Bowl", price: 30 },
          ],
        };

        setExtrasMenu(mockData);

        const initialItems = {};
        Object.keys(mockData).forEach((meal) => {
          initialItems[meal] = [];
          mockData[meal].forEach((item) => {
            initialItems[meal].push({ ...item, qty: 0 });
          });
        });
        setItemsData(initialItems);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load extras menu.");
      }
    }
    fetchExtras();
  }, [selectedDate]);

  // Handle quantity changes
  const handleQuantity = (itemName, delta, meal) => {
    setItemsData((prev) => {
      const updatedMeal = [
        ...prev[meal].map((item)=>(
          item.name===itemName?{...item,qty:Math.max(0,item.qty+delta)}:item
        ))
      ];
      return {
        ...prev,
        [meal]: updatedMeal,
      };
    });

    setTotalAmount((prevTotal) => {
      const item=extrasMenu[meal].find(i=>i.name===itemName);
      return Math.max(0, prevTotal + (item ? item.price * delta : 0));
    });
  };

  // Handle purchase confirmation
  const handleConfirm = () => {
    setShowConfirm(true);
  };

  // Handle actual purchase
  const handlePurchase = async () => {
    try {
      //$$ Simulate API call to backend
      console.log("Purchasing extras:", { date: selectedDate, data: itemsData });
      toast.success("Extras purchase updated successfully!");
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update extras purchase.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="student-home-container">
        <header className="student-header">
          <h1>
            <i className="fas fa-plus-circle"></i> Purchase Extra Items
          </h1>
          <p>Select date and update your extra purchases for each meal</p>

          <div className="date-picker">
            <label htmlFor="extras-date">Select Date:</label>
            <input
              type="date"
              id="extras-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </header>

        <div className="menu-grid">
          {Object.keys(extrasMenu).map((meal) => (
            <div key={meal} className={`menu-card ${meal}`}>
              <div
                className={`menu-icon ${
                  meal === "breakfast"
                    ? "orange"
                    : meal === "lunch"
                    ? "green"
                    : "teal"
                }`}
              >
                <i
                  className={`fas ${
                    meal === "breakfast"
                      ? "fa-mug-hot"
                      : meal === "lunch"
                      ? "fa-utensils"
                      : "fa-pizza-slice"
                  }`}
                ></i>
              </div>
              <h2>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h2>

              <div className="diet-section">
                <h3>Extras</h3>
                <ul>
                  {extrasMenu[meal].map((item, index) => {
                    const itemQty = itemsData[meal].find(i=>i.name===item.name)?.qty || 0;
                    return(
                    <li key={index} className="lift extra-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">₹{item.price}</span>
                      </div>

                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantity(item.name, -1, meal)}
                          disabled={itemQty <= 0}
                        >
                          −
                        </button>
                        <span className="qty">
                          {itemQty || 0}
                        </span>
                        <button
                          onClick={() => handleQuantity(item.name, +1, meal)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  )})}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="extras-summary">
          <h3>Total Amount:</h3>
          <p className="total-price">₹{totalAmount}</p>
          <button
            className="update-btn"
            onClick={handleConfirm}
            disabled={totalAmount === 0}
          >
            Update Purchase
          </button>
        </div>

        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h3>Confirm Purchase</h3>
              <p>
                Are you sure you want to purchase these extras for ₹{totalAmount}?
              </p>
              <div className="confirm-buttons">
                <button className="yes-btn" onClick={handlePurchase}>
                  Yes, Confirm
                </button>
                <button className="no-btn" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
