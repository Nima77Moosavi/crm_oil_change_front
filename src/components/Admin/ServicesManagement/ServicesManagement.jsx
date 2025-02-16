import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ServicesManagement.module.css";

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    base_fee: "",
  });
  const [editingService, setEditingService] = useState(null);
  const [updatedService, setUpdatedService] = useState({
    name: "",
    description: "",
    base_fee: "",
  });
  const [error, setError] = useState(null);

  // Fetch services from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/crm/services/")
      .then((response) => {
        setServices(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch services.");
      });
  }, []);

  // Create service
  const handleCreateService = () => {
    axios
      .post("http://127.0.0.1:8000/crm/services/", newService)
      .then((response) => {
        setServices([...services, response.data]);
        setNewService({ name: "", description: "", base_fee: "" });
      })
      .catch((err) => {
        setError("Failed to create service.");
      });
  };

  // Update service
  const handleUpdateService = () => {
    axios
      .put(
        `http://127.0.0.1:8000/crm/services/${editingService.id}/`,
        updatedService
      )
      .then((response) => {
        const updatedServices = services.map((service) =>
          service.id === editingService.id ? response.data : service
        );
        setServices(updatedServices);
        setEditingService(null);
        setUpdatedService({ name: "", description: "", base_fee: "" });
      })
      .catch((err) => {
        setError("Failed to update service.");
      });
  };

  // Delete service
  const handleDeleteService = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/crm/services/${id}/`)
      .then(() => {
        setServices(services.filter((service) => service.id !== id));
      })
      .catch((err) => {
        setError("Failed to delete service.");
      });
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.title}>مدیریت خدمات</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Create service form */}
      <div className={styles.formGroup}>
        <h3>افزودن سرویس جدید</h3>
        <input
          className={styles.input}
          type="text"
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
          placeholder="نام سرویس"
        />
        <textarea
          className={styles.input}
          value={newService.description}
          onChange={(e) =>
            setNewService({ ...newService, description: e.target.value })
          }
          placeholder="توضیحات"
        />
        <input
          className={styles.input}
          type="number"
          value={newService.base_fee}
          onChange={(e) =>
            setNewService({ ...newService, base_fee: e.target.value })
          }
          placeholder="هزینه"
        />
        <button className={styles.button} onClick={handleCreateService}>
          ایجاد سرویس
        </button>
      </div>

      {/* Edit service form */}
      {editingService && (
        <div className={styles.formGroup}>
          <h3>ویرایش سرویس</h3>
          <input
            className={styles.input}
            type="text"
            value={updatedService.name}
            onChange={(e) =>
              setUpdatedService({ ...updatedService, name: e.target.value })
            }
            placeholder="نام سرویس"
          />
          <textarea
            className={styles.input}
            value={updatedService.description}
            onChange={(e) =>
              setUpdatedService({
                ...updatedService,
                description: e.target.value,
              })
            }
            placeholder="توضیحات"
          />
          <input
            className={styles.input}
            type="number"
            value={updatedService.base_fee}
            onChange={(e) =>
              setUpdatedService({ ...updatedService, base_fee: e.target.value })
            }
            placeholder="هزینه"
          />
          <button className={styles.button} onClick={handleUpdateService}>
            به‌روزرسانی سرویس
          </button>
        </div>
      )}

      {/* Services List */}
      <h3>لیست سرویس‌ها</h3>
      <ul className={styles.servicesList}>
        {services.map((service) => (
          <li key={service.id} className={styles.serviceItem}>
            <span>{service.name}</span>
            <span>{service.base_fee} تومان</span>
            <button
              className={`${styles.button} ${styles.editButton}`}
              onClick={() => {
                setEditingService(service);
                setUpdatedService({
                  name: service.name,
                  description: service.description,
                  base_fee: service.base_fee,
                });
              }}
            >
              ویرایش
            </button>
            <button
              className={styles.button}
              onClick={() => handleDeleteService(service.id)}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesManagement;
