import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CustomersManagement.module.css";
import pelak from "../../../assets/pelak.jpg";

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ phone_number: "" });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedCustomer, setUpdatedCustomer] = useState({ phone_number: "" });
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
        setNewCustomer({ phone_number: "" });
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
        setUpdatedCustomer({ phone_number: "" });
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
        <div className={styles.pelakContainer}>
          <img src={pelak} alt="پلاک ماشین" className={styles.pelak} />
          <div className={styles.inputsOverlay}>
          <input
              type="text"
              className={styles.lastPelakInput}
              maxLength="2"
              placeholder="۶۷"
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="3"
              placeholder="۱۲۲"
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="1"
              placeholder="ق"
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="2"
              placeholder="۶۷"
            />
            
          </div>
        </div>
        <input
          className={styles.input}
          type="tel"
          value={newCustomer.phone_number}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone_number: e.target.value })
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
            type="tel"
            value={updatedCustomer.phone_number}
            onChange={(e) =>
              setUpdatedCustomer({
                ...updatedCustomer,
                phone_number: e.target.value,
              })
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
            <span>{customer.phone_number}</span>
            <button
              className={`${styles.button} ${styles.editButton}`}
              onClick={() => {
                setEditingCustomer(customer);
                setUpdatedCustomer({ phone_number: customer.phone_number });
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
