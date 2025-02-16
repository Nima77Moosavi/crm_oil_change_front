import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
