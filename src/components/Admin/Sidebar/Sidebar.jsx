// Sidebar.jsx - Sidebar Navigation
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <ul>
        <li><NavLink to="/admin/customers">مدیریت مشتریان</NavLink></li>
        <li><NavLink to="/admin/services">مدیریت خدمات</NavLink></li>
        <li><NavLink to="/admin/inventory">مدیریت موجودی</NavLink></li>
        <li><NavLink to="/admin/appointments">مدیریت اطلاعات</NavLink></li>
      </ul>
    </nav>
  );
};

export default Sidebar;