
import React, { useEffect, useState } from "react";
 import { analyticsApi, productApi } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ReferenceLine
} from "recharts";
 
import "./Analytics.css";

function Analytics() {

  const [revenue, setRevenue] = useState(0);
  const [bestSelling, setBestSelling] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
const [selectedProduct, setSelectedProduct] = useState("");
const [forecastDays, setForecastDays] = useState(30);
const [planningDays, setPlanningDays] = useState(7);
const [forecast, setForecast] = useState(null);
const [restock, setRestock] = useState(null);
const [forecastLoading, setForecastLoading] = useState(false);
const [productSales, setProductSales] = useState([]);


useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [revenueData, bestSellingData, dailySalesData] =
        await Promise.all([
          analyticsApi.getTotalRevenue(),
          analyticsApi.getBestSellingProducts(),
          analyticsApi.getDailySales()
        ]);

       setRevenue(revenueData["total revenue"] ?? 0);
      setBestSelling(
        bestSellingData.map((item) => ({
          productId: item[0],
          productName: item[1],
          totalSold: Number(item[2])
        }))
      );

      setDailySales(
        dailySalesData.map((item) => ({
          date: item[0],
          quantity: Number(item[1])
        }))
      );

    } catch (err) {
      console.error("Analytics error:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, []);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await productApi.getAll();
      setProducts(data);

      if (data.length > 0) {
        setSelectedProduct(String(data[0].product_id));
      }
    } catch (err) {
      console.error("Products error:", err);
    }
  };

  fetchProducts();
}, []);

useEffect(() => {
  if (!selectedProduct) return;

  const fetchForecast = async () => {
    try {
      setForecastLoading(true);

      const [forecastData, restockData] = await Promise.all([
        analyticsApi.getForecast(selectedProduct, forecastDays),
        analyticsApi.getRestockSuggestion(
          selectedProduct,
          forecastDays,
          planningDays
        )
      ]);

      setForecast(forecastData);
      setRestock(restockData);

    } catch (err) {
      console.error("Forecast error:", err);
      setForecast(null);
      setRestock(null);
    } finally {
      setForecastLoading(false);
    }
  };

  fetchForecast();
}, [selectedProduct, forecastDays, planningDays]);
useEffect(() => {
  if (!selectedProduct) return;

  const fetchProductSales = async () => {
    try {
      const data = await analyticsApi.getProductDailySales(selectedProduct);

      setProductSales(
        data.map((item) => ({
          date: new Date(item[0]).toLocaleDateString("en-IN"),
          quantity: Number(item[1])
        }))
      );
    } catch (err) {
      console.error("Product sales error:", err);
    }
  };

  fetchProductSales();
}, [selectedProduct]);

  return (
    <div className="analytics-page">
        {loading && <p>Loading analytics...</p>}

        {error && <p className="analytics-error">{error}</p>}
      <h1>Sales Analytics</h1>
      <p>Track your sales performance and product demand.</p>

      
{!loading && !error && (
  <div className="analytics-stats">

    <div className="analytics-card">
      <h3>Total Revenue</h3>
      <h2>
        ₹{Number(revenue).toLocaleString("en-IN")}
      </h2>
    </div>

    <div className="analytics-card">
      <h3>Products Sold</h3>
      <h2>
        {bestSelling.reduce(
          (total, item) => total + item.totalSold, 0
        )}
      </h2>
    </div>

    <div className="analytics-card">
      <h3>Best Selling Product</h3>
      <h2>
        {bestSelling.length > 0
          ? bestSelling[0].productName
          : "No sales yet"}
      </h2>
    </div>

  </div>
)}


      
{!loading && !error && (
  <div className="analytics-charts">

    <div className="chart-card">
      <h3>Daily Sales Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke="#D97736"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-card">
      <h3>Best Selling Products</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={bestSelling}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="totalSold"
            fill="#D97736"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
)}
{/* Demand Forecast & Restock */}
<div className="forecast-section">
  <h2>Demand Forecast & Restock</h2>
  <p>Predict product demand and plan inventory restocking.</p>

  <div className="forecast-controls">
    <div>
      <label>Select Product</label>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        {products.map((product) => (
          <option
            key={product.product_id}
            value={product.product_id}
          >
            {product.product_name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label>Forecast Period</label>
      <select
        value={forecastDays}
        onChange={(e) => setForecastDays(Number(e.target.value))}
      >
        <option value={7}>7 Days</option>
        <option value={15}>15 Days</option>
        <option value={30}>30 Days</option>
      </select>
    </div>

    <div>
      <label>Planning Period</label>
      <select
        value={planningDays}
        onChange={(e) => setPlanningDays(Number(e.target.value))}
      >
        <option value={7}>7 Days</option>
        <option value={15}>15 Days</option>
        <option value={30}>30 Days</option>
      </select>
    </div>
  </div>

  {forecastLoading ? (
    <p>Calculating demand forecast...</p>
  ) : forecast && restock ? (
    <>
      <div className="forecast-stats">
        <div className="forecast-card">
          <h3>Predicted Daily Demand</h3>
          <h2>{Number(forecast.predictedDailyDemand).toFixed(2)}</h2>
          <span>Units per day</span>
        </div>

        <div className="forecast-card">
          <h3>Current Stock</h3>
          <h2>{restock.currentStock}</h2>
          <span>Available units</span>
        </div>

        <div className="forecast-card">
          <h3>Expected Demand</h3>
          <h2>{restock.expectedDemand}</h2>
          <span>Units in {planningDays} days</span>
        </div>

        <div className="forecast-card">
          <h3>Recommended Restock</h3>
          <h2>{restock.recommendedRestock}</h2>
          <span>
            {restock.restockNeeded
              ? "Restocking required"
              : "No restock needed"}
          </span>
        </div>
      </div>
    </>
  ) : (
    <p>No forecast data available.</p>
  )}
</div>
{/* Product Demand Forecast Chart */}
<div className="chart-card forecast-chart">
  <h3>Product Demand Analysis</h3>
  <p>Historical sales vs predicted daily demand</p>

  {forecastLoading ? (
    <p>Loading chart...</p>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={productSales}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="quantity"
          stroke="#D97736"
          fill="#F5CBA7"
          name="Actual Sales"
        />

        {forecast && (
          <ReferenceLine
            y={Number(forecast.predictedDailyDemand)}
            stroke="#287A55"
            strokeDasharray="5 5"
            label="Predicted Daily Demand"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )}
</div>

    </div>
  );
}

export default Analytics;
