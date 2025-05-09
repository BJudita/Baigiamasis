import { useState } from "react";
import UserForm from "./components/UserForm/UserForm";
import UserList from "./components/UserList/UserList";
import styles from "./App.module.css";
import type { User } from "./types/User";
import logo from "./assets/noagenda_logo_b.png";


function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const refreshUsers = () => setRefreshFlag(!refreshFlag);

  const handleEdit = (user: User) => {
    setUserToEdit(user);
  };

  const handleCancelEdit = () => {
    setUserToEdit(null);
  };

  return (
    <>
      <div className={styles.mainContent}>
        <div className={styles.sideContainer}>
          <div className={styles.sideBox}>
            <div className={styles.sideLogo}>
              {" "}
              <img src={logo} alt="No Agenda" className={styles.logo} />
            </div>
            <div className={styles.sideForm}>
              <UserForm
                onUserCreated={() => {
                  refreshUsers();
                  handleCancelEdit();
                }}
                userToEdit={userToEdit}
                onCancelEdit={handleCancelEdit}
              />
            </div>
            <div className={styles.copyright}>© No Agenda</div>
          </div>
        </div>
        <div className={styles.listContainer}>
          <UserList refresh={refreshFlag} onEditUser={handleEdit} />
        </div>
       
      </div>
    </>
  );
}

export default App;
