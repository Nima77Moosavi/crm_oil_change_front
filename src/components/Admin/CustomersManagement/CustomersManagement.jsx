import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CustomersManagement.module.css";
import pelak from "../../../assets/pelak.jpg";
import { MdDeleteForever } from "react-icons/md";

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    vehicle_number: "",
    name: "",
    info: "",
    phone_mumber: "",
  });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedCustomer, setUpdatedCustomer] = useState({
    vehicle_number: "",
    name: "",
    info: "",
    phone_number: "",
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
    const pelakString = `${pelakValues.part1}${pelakValues.part2}${pelakValues.part3}${pelakValues.part4}`;
    axios
      .post("https://crm-oil-change.liara.run/crm/customers/", {
        ...newCustomer,
        vehicle_number: pelakString,
      })
      .then((response) => {
        setCustomers([...customers, response.data]);
        setNewCustomer({
          vehicle_number: "",
          name: "",
          info: "",
          phone_number: "",
        });
        setPelakValues({ part1: "", part2: "", part3: "", part4: "" }); // ریست کردن فیلدهای پلاک
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
        setUpdatedCustomer({
          vehicle_number: "",
          name: "",
          info: "",
          phone_number: "",
        });
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

  const [pelakValues, setPelakValues] = useState({
    part1: "", // قسمت اول پلاک (۲ رقم)
    part2: "", // قسمت دوم پلاک (۳ رقم)
    part3: "", // قسمت سوم پلاک (۱ حرف)
    part4: "", // قسمت چهارم پلاک (۲ رقم)
  });
  const handlePelakChange = (part, value) => {
    setPelakValues({
      ...pelakValues,
      [part]: value,
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
              value={pelakValues.part1}
              onChange={(e) => handlePelakChange("part1", e.target.value)}
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="3"
              placeholder="۱۲۲"
              value={pelakValues.part2}
              onChange={(e) => handlePelakChange("part2", e.target.value)}
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="1"
              placeholder="ق"
              value={pelakValues.part3}
              onChange={(e) => handlePelakChange("part3", e.target.value)}
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="2"
              placeholder="۶۷"
              value={pelakValues.part4}
              onChange={(e) => handlePelakChange("part4", e.target.value)}
            />
          </div>
        </div>
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
          multiple
          className={styles.input}
          type="text"
          value={newCustomer.info}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, info: e.target.value })
          }
          placeholder="اطلاعات "
        />
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
            type="text"
            value={updatedCustomer.name}
            onChange={(e) =>
              setUpdatedCustomer({ ...updatedCustomer, name: e.target.value })
            }
            placeholder="نام مشتری"
          />
          <input
            multiple
            className={styles.input}
            type="text"
            value={newCustomer.info}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, info: e.target.value })
            }
            placeholder="اطلاعات "
          />
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
        <li className={styles.customerItem}>
          <span>نام مشتری</span>
          <span>شماره تماس</span>
          <span>پلاک</span>
          <span></span>
        </li>
        {customers.map((customer) => (
          <li key={customer.id} className={styles.customerItem}>
            <span>{customer.name}</span>
            <span>{customer.phone_number}</span>
            <span>{customer.vehicle_number}</span>
            <span></span>
            <button
              className={`${styles.button} ${styles.editButton}`}
              onClick={() => {
                setEditingCustomer(customer);
                setUpdatedCustomer({
                  vehicle_number: customer.vehicle_number,
                  name: customer.name,
                  info: customer.info,
                  phone_number: customer.phone_number,
                });
              }}
            >
              ویرایش
            </button>
            <button
              className={`${styles.button} ${styles.deleteButton}`}
              onClick={() => handleDeleteCustomer(customer.id)}
            >
              <MdDeleteForever />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersManagement;
