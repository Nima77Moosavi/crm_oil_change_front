import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AppointmentsManagement.module.css";

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [inventories, setInventories] = useState([]);
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
      .get("https://crm-oil-change.liara.run/crm/inventories/")
      .then((response) => setInventories(response.data))
      .catch(() => setError("خطا در دریافت موجودی"));

    axios
      .get("https://crm-oil-change.liara.run/crm/customers/")
      .then((response) => setCustomers(response.data))
      .catch(() => setError("خطا در دریافت مشتریان"));
  }, []);

  // Handle appointment creation
  const handleCreateAppointment = () => {
    axios
      .post(
        "https://crm-oil-change.liara.run/crm/appointments/",
        newAppointment
      )
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
      console.log(newAppointment.services);
      
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    let total = 0;

    // Calculate cost of selected services
    newAppointment.services.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        total += service.base_fee;
      }
    });

    // Calculate cost of selected items
    newAppointment.items_used.forEach((itemId) => {
      const item = inventories.find((i) => i.id === itemId);
      if (item) {
        total += item.price;
      }
    });

    return total;
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.title}> ثبت اطلاعات مشتری</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Create Appointment Form */}
      <div className={styles.formGroup}>
        <h4>نام مشتری</h4>
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

        <h4>خدمات دریافتی</h4>
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

        <h4>محصولات استفاده شده</h4>
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
          {inventories.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} - {i.price} تومان
            </option>
          ))}
        </select>

        <h4>صورت حساب</h4>
        <div className={styles.invoice}>
          <h5>خدمات انتخاب شده:</h5>
          <ul>
            {newAppointment.services.map((serviceId) => {

              const service = services.find((s) => s.id === serviceId);

              return (
                <li key={serviceId}>
                  {service?.name} - {service?.base_fee} تومان
                </li>
              );
            })}
          </ul>

          <h5>محصولات انتخاب شده:</h5>
          <ul>
            {newAppointment.items_used.map((itemId) => {
              const item = inventories.find((i) => i.id === itemId);
              return (
                <li key={itemId}>
                  {item?.name} - {item?.price} تومان
                </li>
              );
            })}
          </ul>

          <h5>مجموع هزینه:</h5>
          <p>{calculateTotalCost()} تومان</p>
        </div>

        <h4>تاریخ</h4>
        <input
          type="datetime-local"
          className={styles.input}
          value={newAppointment.date_time}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, date_time: e.target.value })
          }
        />

        <button className={styles.button} onClick={handleCreateAppointment}>
          ثبت اطلاعات
        </button>
      </div>

      {/* Appointments List */}
      <h3>تاریخچه</h3>
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
