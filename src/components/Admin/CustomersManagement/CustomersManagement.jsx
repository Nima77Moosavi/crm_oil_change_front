import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CustomersManagement.module.css";

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedCustomer, setUpdatedCustomer] = useState({
    name: "",
    phone: "",
  });
  const [error, setError] = useState(null);

  // Fetch customers from API
  useEffect(() => {
    axios
      .get("https://crm-oil-change.liara.run/crm/customers/")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch(() => {
        setError("خطا در دریافت مشتریان");
      });
  }, []);

  // Create customer
  const handleCreateCustomer = () => {
    axios
      .post("https://crm-oil-change.liara.run/crm/customers/", newCustomer)
      .then((response) => {
        setCustomers([...customers, response.data]);
        setNewCustomer({ name: "", phone: "" });
      })
      .catch(() => {
        setError("خطا در ایجاد مشتری");
      });
  };

  // Update customer
  const handleUpdateCustomer = () => {
    axios
      .put(
        `https://crm-oil-change.liara.run/crm/customers/${editingCustomer.id}/`,
        updatedCustomer
      )
      .then((response) => {
        setCustomers(
          customers.map((c) =>
            c.id === editingCustomer.id ? response.data : c
          )
        );
        setEditingCustomer(null);
        setUpdatedCustomer({ name: "", phone: "" });
      })
      .catch(() => {
        setError("خطا در ویرایش مشتری");
      });
  };

  // Delete customer
  const handleDeleteCustomer = (id) => {
    axios
      .delete(`https://crm-oil-change.liara.run/crm/customers/${id}/`)
      .then(() => {
        setCustomers(customers.filter((c) => c.id !== id));
      })
      .catch(() => {
        setError("خطا در حذف مشتری");
      });
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.title}>مدیریت مشتریان</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Create customer form */}
      <div className={styles.formGroup}>
        <h3>افزودن مشتری جدید</h3>
        <input
          className={styles.input}
          type="text"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
          placeholder="نام مشتری"
        />
        <input
          className={styles.input}
          type="tel"
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
          placeholder="شماره تلفن"
        />
        <button className={styles.button} onClick={handleCreateCustomer}>
          ثبت مشتری
        </button>
      </div>

      {/* Edit customer form */}
      {editingCustomer && (
        <div className={styles.formGroup}>
          <h3>ویرایش مشتری</h3>
          <input
            className={styles.input}
            type="text"
            value={updatedCustomer.name}
            onChange={(e) =>
              setUpdatedCustomer({ ...updatedCustomer, name: e.target.value })
            }
            placeholder="نام مشتری"
          />
          <input
            className={styles.input}
            type="tel"
            value={updatedCustomer.phone}
            onChange={(e) =>
              setUpdatedCustomer({ ...updatedCustomer, phone: e.target.value })
            }
            placeholder="شماره تلفن"
          />
          <button className={styles.button} onClick={handleUpdateCustomer}>
            به‌روزرسانی مشتری
          </button>
        </div>
      )}

      {/* Customers List */}
      <h3>لیست مشتریان</h3>
      <ul className={styles.customersList}>
        {customers.map((customer) => (
          <li key={customer.id} className={styles.customerItem}>
            <span>
              {customer.name} - {customer.phone}
            </span>
            <button
              className={`${styles.button} ${styles.editButton}`}
              onClick={() => {
                setEditingCustomer(customer);
                setUpdatedCustomer({
                  name: customer.name,
                  phone: customer.phone,
                });
              }}
            >
              ویرایش
            </button>
            <button
              className={styles.button}
              onClick={() => handleDeleteCustomer(customer.id)}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersManagement;
