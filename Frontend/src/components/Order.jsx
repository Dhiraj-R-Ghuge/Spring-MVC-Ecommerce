import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Order = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({}); // Track expanded products by orderId + product index

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [baseUrl]);

  const toggleProductDetails = (orderId, index) => {
    const key = `${orderId}-${index}`;
    setExpandedProducts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-info';
      case 'SHIPPED':
        return 'bg-primary';
      case 'DELIVERED':
        return 'bg-success';
      case 'CANCELLED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);

  const calculateOrderTotal = (items) =>
    items.reduce((total, item) => total + item.totalPrice, 0);

  if (loading)
    return (
      <div className="container mt-5 pt-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">Order Management</h2>

      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Orders ({orders.length})</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <React.Fragment key={order.orderId}>
                      <tr>
                        <td><span className="fw-bold">{order.orderId}</span></td>
                        <td>
                          <div>{order.customerName}</div>
                          <div className="text-muted small">{order.email}</div>
                        </td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.items.length}</td>
                        <td className="fw-bold">{formatCurrency(calculateOrderTotal(order.items))}</td>
                        <td>Actions</td>
                      </tr>

                      {/* Product-level rows */}
                      {order.items.map((item, index) => {
                        const key = `${order.orderId}-${index}`;
                        return (
                          <React.Fragment key={key}>
                            <tr>
                              <td colSpan="7">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>{item.productName}</span>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => toggleProductDetails(order.orderId, index)}
                                  >
                                    {expandedProducts[key] ? 'Hide Details' : 'View Details'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expandedProducts[key] && (
                              <tr>
                                <td colSpan="7" className="p-2">
                                  <div className="bg-light p-2 border">
                                    <div><strong>Quantity:</strong> {item.quantity}</div>
                                    <div><strong>Price:</strong> {formatCurrency(item.totalPrice)}</div>
                                    {/* Add more product details if needed */}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
