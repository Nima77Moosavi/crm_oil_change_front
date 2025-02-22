import React, { useState, useEffect, useRef } from "react";
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
    phone_number: "",
  });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedCustomer, setUpdatedCustomer] = useState({
    vehicle_number: "",
    name: "",
    info: "",
    phone_number: "",
  });
  const [error, setError] = useState(null);

  const [pelakValues, setPelakValues] = useState({
    part1: "", // قسمت اول پلاک (۲ رقم)
    part2: "", // قسمت دوم پلاک (۱ حرف)
    part3: "", // قسمت سوم پلاک (۳ رقم)
    part4: "", // قسمت چهارم پلاک (۲ رقم)
  });

  // ایجاد ref برای هر فیلد پلاک
  const part1Ref = useRef(null);
  const part2Ref = useRef(null);
  const part3Ref = useRef(null);
  const part4Ref = useRef(null);

  const handlePelakChange = (part, value) => {
    setPelakValues({
      ...pelakValues,
      [part]: value,
    });

    // انتقال فوکوس به فیلد بعدی
    if (part === "part1" && value.length === 2) {
      part2Ref.current.focus();
    } else if (part === "part2" && value.length === 1) {
      part3Ref.current.focus();
    } else if (part === "part3" && value.length === 3) {
      part4Ref.current.focus();
    }
  };

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
    const pelakString = `${pelakValues.part3}${pelakValues.part4}${pelakValues.part2}${pelakValues.part1}`;
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
        setPelakValues({ part4: "", part3: "", part2: "", part1: "" }); // ریست کردن فیلدهای پلاک
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
              placeholder="۶۲"
              value={pelakValues.part4}
              onChange={(e) => handlePelakChange("part4", e.target.value)}
              ref={part4Ref}
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="3"
              placeholder="۱۲۲"
              value={pelakValues.part3}
              onChange={(e) => handlePelakChange("part3", e.target.value)}
              ref={part3Ref}
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="1"
              placeholder="ق"
              value={pelakValues.part2}
              onChange={(e) => handlePelakChange("part2", e.target.value)}
              ref={part2Ref}
            />
            <input
              type="text"
              className={styles.pelakInput}
              maxLength="2"
              placeholder="۶۷"
              value={pelakValues.part1}
              onChange={(e) => handlePelakChange("part1", e.target.value)}
              ref={part1Ref}
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
        <li className={styles.customerTitle}>
          <span>نام مشتری</span>
          <span>شماره تماس</span>
          <span>پلاک</span>
        </li>
        {customers.map((customer) => (
          <li key={customer.id} className={styles.customerItem}>
            <span>{customer.name}</span>
            <span>{customer.phone_number}</span>
            <span>
  {customer.vehicle_number.length >= 1
    ? `${customer.vehicle_number.slice(0, 3)}-${customer.vehicle_number.slice(3)}`
    : customer.vehicle_number}
</span>
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