import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AppointmentsManagement.module.css";
import { toJalaali } from "jalaali-js";
import { TiPrinter } from "react-icons/ti";

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
  const [selectedAppointment, setSelectedAppointment] = useState(null); // برای نمایش جزئیات فاکتور

  // تابع کمکی برای فرمت‌کردن قیمت
  const formatPrice = (price) => {
    return price?.toLocaleString() || "۰"; // اگر قیمت undefined یا null بود، "۰" برگردان
  };

  // تابع کمکی برای تبدیل تاریخ به شمسی
  const formatJalaliDate = (date) => {
    const currentDate = new Date(date);
    const jalaliDate = toJalaali(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    return `${jalaliDate.jy}/${jalaliDate.jm}/${jalaliDate.jd}`;
  };

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
  };

  // Handle service selection
  const handleServiceChange = (e) => {
    const serviceId = Number(e.target.value);
    const isChecked = e.target.checked;

    setNewAppointment((prev) => {
      if (isChecked) {
        return { ...prev, services: [...prev.services, serviceId] };
      } else {
        return {
          ...prev,
          services: prev.services.filter((id) => id !== serviceId),
        };
      }
    });
  };

  // Handle item selection
  const handleItemChange = (e) => {
    const itemId = Number(e.target.value);
    const isChecked = e.target.checked;

    setNewAppointment((prev) => {
      if (isChecked) {
        return { ...prev, items_used: [...prev.items_used, itemId] };
      } else {
        return {
          ...prev,
          items_used: prev.items_used.filter((id) => id !== itemId),
        };
      }
    });
  };

  // محاسبه مجموع هزینه
  const calculateTotalCost = () => {
    let total = 0;

    // محاسبه هزینه خدمات انتخاب شده
    newAppointment.services.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        total += parseFloat(service.base_fee);
      }
    });

    // محاسبه هزینه محصولات استفاده شده
    newAppointment.items_used.forEach((itemId) => {
      const item = inventories.find((i) => i.id === itemId);
      if (item) {
        total += parseFloat(item.price);
      }
    });

    return total;
  };

  // نمایش جزئیات فاکتور
  const handleShowDetails = (appt) => {
    setSelectedAppointment(appt);
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
            <option key={c.id} value={c.id} >
              {c.name}
            </option>
          ))}
        </select>

        <h4>خدمات دریافتی</h4>
        <div className={styles.checkboxGroup}>
          {services.map((s) => (
            <label key={s.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={s.id}
                checked={newAppointment.services.includes(s.id)}
                onChange={handleServiceChange}
              />
              {s.name} - {formatPrice(s.base_fee)} تومان
            </label>
          ))}
        </div>

        <h4>محصولات استفاده شده</h4>
        <div className={styles.checkboxGroup}>
          {inventories.map((i) => (
            <label key={i.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={i.id}
                checked={newAppointment.items_used.includes(i.id)}
                onChange={handleItemChange}
              />
              {i.name} - {formatPrice(i.price)} تومان
            </label>
          ))}
        </div>

        <h5 className={styles.receiptHeader}>فیش صورت‌حساب</h5>
        <div className={styles.receiptContainer}>
          <div className={styles.receiptHeader}>فاکتور فروش</div>

          {/* نمایش نام مشتری و تاریخ شمسی */}
          <div className={styles.customerInfo}>
            <span className={styles.customerName}>
              مشتری:{" "}
              {customers.find((c) => c.id === Number(newAppointment.customer))?.name || "نامشخص"}
            </span>
            <span className={styles.jalaliDate}>
              تاریخ: {formatJalaliDate(new Date())}
            </span>
          </div>

          <ul className={styles.receiptItems}>
            {newAppointment.services.map((serviceId) => {
              const service = services.find((s) => s.id === serviceId);
              return (
                <li key={`service-${serviceId}`} className={styles.receiptItem}>
                  <span>{service?.name}</span>
                  <span>{formatPrice(service?.base_fee)} تومان</span>
                </li>
              );
            })}

            {newAppointment.items_used.map((itemId) => {
              const item = inventories.find((i) => i.id === itemId);
              return (
                <li key={`item-${itemId}`} className={styles.receiptItem}>
                  <span>{item?.name}</span>
                  <span>{formatPrice(item?.price)} تومان</span>
                </li>
              );
            })}
          </ul>

          <div className={styles.receiptTotal}>
            <span>مجموع هزینه:&nbsp;</span>
            <span>{formatPrice(calculateTotalCost())} تومان</span>
          </div>

          {/* دکمه چاپ فاکتور */}
          <button className={styles.printButton} onClick={() => window.print()}>
            چاپ فاکتور <TiPrinter />
          </button>
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
              {appt.customer} - {formatJalaliDate(appt.date_time)} -{" "}
              {formatPrice(appt.total_cost)} تومان
            </span>
            <button
              className={styles.detailsButton}
              onClick={() => handleShowDetails(appt)}
            >
              نمایش جزئیات
            </button>
          </li>
        ))}
      </ul>

      {/* نمایش جزئیات فاکتور انتخاب شده */}
      {selectedAppointment && (
        <div className={styles.detailsModal}>
          <h4>جزئیات فاکتور</h4>
          <p>
            مشتری:{" "}
            {customers.find((c) => c.id === Number(newAppointment.customer))?.name || "نامشخص"}
          </p>
          <p>تاریخ: {formatJalaliDate(selectedAppointment.date_time)}</p>
          <p>مجموع هزینه: {formatPrice(selectedAppointment.total_cost)} تومان</p>
          <h5>خدمات دریافتی:</h5>
          <ul>
            {selectedAppointment.services.map((serviceId) => {
              const service = services.find((s) => s.id === serviceId);
              return (
                <li key={`service-${serviceId}`}>
                  {service?.name} - {formatPrice(service?.base_fee)} تومان
                </li>
              );
            })}
          </ul>
          <h5>محصولات استفاده شده:</h5>
          <ul>
            {selectedAppointment.items_used.map((itemId) => {
              const item = inventories.find((i) => i.id === itemId);
              return (
                <li key={`item-${itemId}`}>
                  {item?.name} - {formatPrice(item?.price)} تومان
                </li>
              );
            })}
          </ul>
          <button
            className={styles.closeButton}
            onClick={() => setSelectedAppointment(null)}
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsManagement;