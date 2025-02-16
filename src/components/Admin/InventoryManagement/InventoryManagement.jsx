import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./InventoryManagement.module.css";

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({ name: "", price: "" });
  const [error, setError] = useState(null);

  // Fetch inventory items from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/crm/inventories/")
      .then((response) => {
        setInventoryItems(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch inventory items.");
      });
  }, []);

  // Create inventory item
  const handleCreateItem = () => {
    axios
      .post("http://127.0.0.1:8000/crm/inventory/", newItem)
      .then((response) => {
        setInventoryItems([...inventoryItems, response.data]);
        setNewItem({ name: "", price: "" });
      })
      .catch((err) => {
        setError("Failed to create inventory item.");
      });
  };

  // Update inventory item
  const handleUpdateItem = () => {
    axios
      .put(
        `http://127.0.0.1:8000/crm/inventory/${editingItem.id}/`,
        updatedItem
      )
      .then((response) => {
        const updatedItems = inventoryItems.map((item) =>
          item.id === editingItem.id ? response.data : item
        );
        setInventoryItems(updatedItems);
        setEditingItem(null);
        setUpdatedItem({ name: "", price: "" });
      })
      .catch((err) => {
        setError("Failed to update inventory item.");
      });
  };

  // Delete inventory item
  const handleDeleteItem = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/crm/inventory/${id}/`)
      .then(() => {
        setInventoryItems(inventoryItems.filter((item) => item.id !== id));
      })
      .catch((err) => {
        setError("Failed to delete inventory item.");
      });
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.title}>مدیریت موجودی</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Create item form */}
      <div className={styles.formGroup}>
        <h3>افزودن کالای جدید</h3>
        <input
          className={styles.input}
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="نام کالا"
        />
        <input
          className={styles.input}
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          placeholder="قیمت"
        />
        <button className={styles.button} onClick={handleCreateItem}>
          ایجاد کالا
        </button>
      </div>

      {/* Edit item form */}
      {editingItem && (
        <div className={styles.formGroup}>
          <h3>ویرایش کالا</h3>
          <input
            className={styles.input}
            type="text"
            value={updatedItem.name}
            onChange={(e) =>
              setUpdatedItem({ ...updatedItem, name: e.target.value })
            }
            placeholder="نام کالا"
          />
          <input
            className={styles.input}
            type="number"
            value={updatedItem.price}
            onChange={(e) =>
              setUpdatedItem({ ...updatedItem, price: e.target.value })
            }
            placeholder="قیمت"
          />
          <button className={styles.button} onClick={handleUpdateItem}>
            به‌روزرسانی کالا
          </button>
        </div>
      )}

      {/* Inventory List */}
      <h3>لیست کالاها</h3>
      <ul className={styles.servicesList}>
        {inventoryItems.map((item) => (
          <li key={item.id} className={styles.serviceItem}>
            <span>{item.name}</span>
            <span>{item.price} تومان</span>
            <button
              className={`${styles.button} ${styles.editButton}`}
              onClick={() => {
                setEditingItem(item);
                setUpdatedItem({
                  name: item.name,
                  price: item.price,
                });
              }}
            >
              ویرایش
            </button>
            <button
              className={styles.button}
              onClick={() => handleDeleteItem(item.id)}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryManagement;
