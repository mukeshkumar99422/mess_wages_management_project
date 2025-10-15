import { useEffect, useState } from "react";
import "./dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import Navbar from "../Navbar/Navbar";

export default function Dashboard() {
  //one month data by default
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toISOString().slice(0, 10);
  });

  const [extraItemsData, setExtraItemsData] = useState([]); // To store fetched data

  //1st part
  const [totalSpending, setTotalSpending] = useState(0);
  const [mealWiseSpending, setMealWiseSpending] = useState([
    { name: "Breakfast", value: 0 },
    { name: "Lunch", value: 0 },
    { name: "Dinner", value: 0 },
  ]);

  //2nd part
  const [favoriteItem, setFavoriteItem] = useState("");
  const [itemWiseFreq, setItemWiseFreq] = useState([]);

  //3rd part
  const [trendType, setTrendType] = useState("weekly"); // daily, weekly, monthly
  const [trendData, setTrendData] = useState([]);

  //on load page
  useEffect(() => {
    const fetchData = async () => {
      try {
        //$$ api call to fetch data
        const fetchedData = [
          {
            date: "2025-09-15", 
            breakfast: [
              { name: "Idli with Sambar", price: 30, qty: 2 },
              { name: "Filter Coffee", price: 20, qty: 1 },
            ],
            lunch: [{ name: "Veg Thali", price: 100, qty: 1 }],
            dinner: [{ name: "Paneer Butter Masala", price: 130, qty: 1 }],
          },
          {
            date: "2025-09-28", 
            breakfast: [{ name: "Poha", price: 25, qty: 2 }],
            lunch: [
              { name: "Dal Makhani", price: 90, qty: 1 },
              { name: "Roti", price: 10, qty: 3 },
            ],
            dinner: [{ name: "Chicken Biryani", price: 180, qty: 1 }],
          },
          {
            date: "2025-10-05",
            breakfast: [{ name: "Masala Dosa", price: 40, qty: 1 }],
            lunch: [{ name: "Rajma Chawal", price: 80, qty: 1 }],
            dinner: [{ name: "Egg Curry", price: 90, qty: 1 }],
          },
          {
            date: "2025-08-25",
            breakfast: [
              { name: "Aloo Paratha", price: 25, qty: 2 },
              { name: "Curd", price: 10, qty: 1 },
            ],
            lunch: [{ name: "Veg Fried Rice", price: 85, qty: 1 }],
            dinner: [
              { name: "Butter Naan", price: 30, qty: 2 },
              { name: "Paneer Tikka", price: 120, qty: 1 },
            ],
          },
          {
            date: "2025-07-20",
            breakfast: [{ name: "Upma", price: 25, qty: 2 }],
            lunch: [{ name: "Chole Bhature", price: 90, qty: 1 }],
            dinner: [{ name: "Fish Curry", price: 170, qty: 1 }],
          },
          {
            date: "2025-06-10",
            breakfast: [{ name: "Idli with Coconut Chutney", price: 35, qty: 2 }],
            lunch: [
              { name: "Fried Rice", price: 80, qty: 1 },
              { name: "Gobi Manchurian", price: 70, qty: 1 },
            ],
            dinner: [{ name: "Paneer Tikka", price: 140, qty: 1 }],
          },
        ];
        setExtraItemsData(fetchedData);
      } catch (err) {
        console.error("Error fetching spending data:", err);
        setExtraItemsData([]);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Compute stats
  useEffect(() => {
    if (extraItemsData.length > 0) {
      // Meal-wise
      setTotalSpending(
        extraItemsData.reduce(
          (total, obj) =>
            total +
            obj["breakfast"].reduce((t1, itm1) => t1 + itm1.price * itm1.qty, 0) +
            obj["lunch"].reduce((t2, itm2) => t2 + itm2.price * itm2.qty, 0) +
            obj["dinner"].reduce((t3, itm3) => t3 + itm3.price * itm3.qty, 0),
          0
        )
      );

      setMealWiseSpending([
        {
          name: "Breakfast",
          value: extraItemsData.reduce(
            (total, obj) =>
              total +
              obj["breakfast"].reduce((t1, itm1) => t1 + itm1.price * itm1.qty, 0),
            0
          ),
        },
        {
          name: "Lunch",
          value: extraItemsData.reduce(
            (total, obj) =>
              total +
              obj["lunch"].reduce((t1, itm1) => t1 + itm1.price * itm1.qty, 0),
            0
          ),
        },
        {
          name: "Dinner",
          value: extraItemsData.reduce(
            (total, obj) =>
              total +
              obj["dinner"].reduce((t1, itm1) => t1 + itm1.price * itm1.qty, 0),
            0
          ),
        },
      ]);

      // Item-wise
      const freq = {};
      extraItemsData.forEach((obj) => {
        ["breakfast", "lunch", "dinner"].forEach((meal) => {
          obj[meal].forEach((i) => {
            freq[i.name] = (freq[i.name] || 0) + i.qty;
          });
        });
      });

      const freqArray = Object.entries(freq).map(([name, freq]) => ({
        name,
        freq,
      }));
      setItemWiseFreq(freqArray);

      const fav = freqArray.reduce(
        (max, item) => (item.freq > max.freq ? item : max),
        { name: "", freq: 0 }
      );
      setFavoriteItem(fav.name);
    }
  }, [extraItemsData]);

  // ---- Trend data ----
  useEffect(() => {
    if (extraItemsData.length === 0) {
      setTrendData([]);
      return;
    }

    // Define the date range (1 month back from today)
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Grouping logic
    const grouped = {};

    extraItemsData.forEach((entry) => {
      const dateObj = new Date(entry.date);

      // ✅ Ignore entries outside the one-month range
      if (dateObj < oneMonthAgo || dateObj > today) return;

      let key = "";

      if (trendType === "daily") {
        key = entry.date; // YYYY-MM-DD
      } else if (trendType === "weekly") {
        const weekNum = Math.ceil(
          (dateObj.getDate() + ((dateObj.getDay() + 1) % 7)) / 7
        );
        key = `${dateObj.getFullYear()}-W${weekNum}`;
      } else if (trendType === "monthly") {
        key = `${dateObj.getFullYear()}-${String(
          dateObj.getMonth() + 1
        ).padStart(2, "0")}`;
      }

      if (!grouped[key]) grouped[key] = 0;

      // ✅ Sum total spend (price × qty for all meals)
      ["breakfast", "lunch", "dinner"].forEach((mealType) => {
        entry[mealType]?.forEach((item) => {
          grouped[key] += item.price * item.qty;
        });
      });
    });

    // Convert grouped data to array and sort by key
    const trendArr = Object.entries(grouped)
      .map(([day, spend]) => ({ day, spend }))
      .sort((a, b) => (a.day > b.day ? 1 : -1));

    setTrendData(trendArr);
  }, [extraItemsData, trendType]);



  const COLORS = ["#16a34a", "#22c55e", "#4ade80"];

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>
            <i className="fas fa-chart-line"></i> Student Dashboard
          </h1>
          <p>Track your extra item purchases and spending trends</p>
        </header>

        {/* --- SPENDING ANALYSIS --- */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-wallet"></i> Overall Spending Analysis
            </h2>
            <div className="date-range">
              <div>
                <label>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="analysis-content">
            <div className="summary-card glass">
              <h3>Total Spending</h3>
              <p className="price">₹{totalSpending}</p>
            </div>

            <div className="chart-card glass">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mealWiseSpending}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {mealWiseSpending.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* --- ITEM WISE ANALYSIS --- */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-utensils"></i> Item-wise Spending Analysis
            </h2>
            <div className="date-range">
              <div>
                <label>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="analysis-content">
            <div className="summary-card glass">
              <h3>Favorite Item</h3>
              <p className="fav-item">
                <i className="fas fa-star"></i> {favoriteItem}
              </p>
            </div>

            <div className="chart-card glass">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={itemWiseFreq}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="freq" fill="#16a34a" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* --- TREND ANALYSIS --- */}
        <section className="dashboard-section">
          <div className="section-header trend-header">
            <div className="trend-header-top">
              <h2>
                <i className="fas fa-chart-area"></i> Spending Trend Analysis
              </h2>
              <div className="date-range">
                <div>
                  <label>From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label>To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="trend-buttons fixed-below">
              {["daily", "weekly", "monthly"].map((t) => (
                <button
                  key={t}
                  className={`trend-btn ${trendType === t ? "active" : ""}`}
                  onClick={() => setTrendType(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-card glass large">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="spend"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}
