import { useEffect, useState } from "react";
import "./student_home.css";
import { toast } from "react-hot-toast";
import img1 from '../../assets/itemsNotUpdated.png'

export default function StudentHomePage() {
  const [menu, setMenu] = useState({
    breakfast: { items: [], extras: [] },
    lunch: { items: [], extras: [] },
    dinner: { items: [], extras: [] },
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );


  // Fetch menu data when selectedDate changes
  useEffect(() => {
    async function fetchMenu() {
      try {
        //$$ Simulate fetching today's menu (later replace with API)
        const data = {
          breakfast: {
            items: ["Idli & Sambar", "Banana", "Milk / Tea"],
            extras: ["Peanut Chutney", "Lemon Pickle"],
          },
          lunch: {
            items: ["Rice", "Dal Fry", "Paneer Butter Masala", "Salad"],
            extras: ["Papad", "Sweet Lassi"],
          },
          dinner: {
            items: [],
            extras: [],
          },
        };
        setMenu(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load today's menu.");
      }
    }

    fetchMenu();
  }, [selectedDate]);

  return (
    <div className="student-home-container">
      <header className="student-header">
        <h1>
          <i className="fas fa-utensils"></i> Hostel Mess Menu
        </h1>
        <p>Fresh, healthy & delicious meals curated just for you 🍃</p>

        <div className="date-picker">
          <label htmlFor="menu-date">Select Date:</label>
          <input
            type="date"
            id="menu-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </header>

      <div className="menu-grid">
        {[
          { key: "breakfast", icon: "fa-mug-hot", color: "orange" },
          { key: "lunch", icon: "fa-utensil-spoon", color: "green" },
          { key: "dinner", icon: "fa-pizza-slice", color: "teal" },
        ].map((meal) => {
          const hasData =
            menu[meal.key].items.length > 0 ||
            menu[meal.key].extras.length > 0;
          return (
          <div key={meal.key} className={`menu-card ${meal.key}`}>
            <div className={`menu-icon ${meal.color}`}>
              <i className={`fas ${meal.icon}`}></i>
            </div>
            <h2>
              {meal.key.charAt(0).toUpperCase() + meal.key.slice(1)}
            </h2>

            {hasData?(<div className="menu-sections">
              {/* Main Items Section */}
              <div className="diet-section">
                <h3>Main Items</h3>
                <ul>
                  {menu[meal.key].items.map((item, index) => (
                    <li key={index} className="lift">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Extras Section */}
              <div className="extra-section">
                <h3>Extras</h3>
                <ul>
                  {menu[meal.key].extras.map((extra, index) => (
                    <li key={index} className="lift extra-item">
                      {extra}
                    </li>
                  ))}
                </ul>
              </div>
            </div>):(
              <div className="not-updated">
                  <div className="placeholder-img">
                    <img src={img1} alt="Menu Not Updated" />
                  </div>
                  <p>Menu not updated yet for this meal.</p>
                </div>
            )}
          </div>);
        })}
      </div>
    </div>
  );
}

