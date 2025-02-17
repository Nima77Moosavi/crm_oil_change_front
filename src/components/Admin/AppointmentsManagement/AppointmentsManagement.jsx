import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AppointmentsManagement.module.css";

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    services: [],
    items_used: [],
    date_time: "",
  });
  const [error, setError] = useState(null);

  // Fetch appointments
  useEffect(() => {
    axios
      .get("https://crm-oil-change.liara.run/crm/appointments/")
      .then((response) => setAppointments(response.data))
      .catch(() => setError("خطا در دریافت نوبت‌ها"));

    axios
      .get("https://crm-oil-change.liara.run/crm/services/")
      .then((response) => setServices(response.data))
      .catch(() => setError("خطا در دریافت سرویس‌ها"));

    axios
      .get("https://crm-oil-change.liara.run/crm/inventory/")
      .then((response) => setInventory(response.data))
      .catch(() => setError("خطا در دریافت موجودی"));

    axios
      .get("https://crm-oil-change.liara.run/crm/customers/")
      .then((response) => setCustomers(response.data))
      .catch(() => setError("خطا در دریافت مشتریان"));
  }, []);

  // Handle appointment creation
  const handleCreateAppointment = () => {
    axios
      .post("https://crm-oil-change.liara.run/crm/appointments/", newAppointment)
      .then((response) => {
        setAppointments([...appointments, response.data]);
        setNewAppointment({
          customer: "",
          services: [],
          items_used: [],
          date_time: "",
        });
      })
      .catch(() => setError("خطا در ایجاد نوبت"));
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.title}>مدیریت نوبت‌ها</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Create Appointment Form */}
      <div className={styles.formGroup}>
        <h3>افزودن نوبت جدید</h3>
        <select
          className={styles.input}
          value={newAppointment.customer}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, customer: e.target.value })
          }
        >
          <option value="">انتخاب مشتری</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          multiple
          className={styles.input}
          value={newAppointment.services}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              services: [...e.target.selectedOptions].map((o) => o.value),
            })
          }
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} - {s.base_fee} تومان
            </option>
          ))}
        </select>

        <select
          multiple
          className={styles.input}
          value={newAppointment.items_used}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              items_used: [...e.target.selectedOptions].map((o) => o.value),
            })
          }
        >
          {inventory.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} - {i.price} تومان
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className={styles.input}
          value={newAppointment.date_time}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, date_time: e.target.value })
          }
        />

        <button className={styles.button} onClick={handleCreateAppointment}>
          ثبت نوبت
        </button>
      </div>

      {/* Appointments List */}
      <h3>لیست نوبت‌ها</h3>
      <ul className={styles.appointmentsList}>
        {appointments.map((appt) => (
          <li key={appt.id} className={styles.appointmentItem}>
            <span>
              {appt.customer} - {appt.date_time}
            </span>
            <span>{appt.total_cost} تومان</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsManagement;
