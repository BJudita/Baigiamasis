import React, { useEffect, useState } from "react";
import type { User } from "../../types/User";
import { deleteUser, fetchUsers } from "../../api/userApi";
import styles from "./UserList.module.css";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import next from "../../assets/next.png";
import prev from "../../assets/prev.png";

interface Props {
  refresh: boolean;
  onEditUser: (user: User) => void;
}

interface Error {
  message: string;
}

const UserList: React.FC<Props> = ({ refresh, onEditUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 12;
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
        setTotalPages(Math.ceil(data.length / limit));
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError({ message: err.message });
        } else {
          setError({ message: "Unknown error" });
        }
        setLoading(false);
      }
    };
    load();
  }, [refresh]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [users, totalPages, page]);

      const handleDelete = async (id: number) => {
        await deleteUser(id);
        const updatedUsers = users.filter((u) => u.id !== id);
        setUsers(updatedUsers);
        setTotalPages(Math.ceil(updatedUsers.length / limit));
      
        setToastMessage("Vartotojas sėkmingai ištrintas!");
        setTimeout(() => setToastMessage(null), 2000); 
      };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  if (loading) return <p>Loading Users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const paginatedUsers = users.slice((page - 1) * limit, page * limit);

  return (  
    <>
    {toastMessage && (
      <div className={styles.toast}>
        {toastMessage}
      </div>
    )}
    <div className={styles.userListContainer}>
  <h2 className={styles.title}>Vartotojai</h2>
  <div className={styles.userListHeader}>
    <div className={styles.headerField}>Vardas</div>
    <div className={styles.headerField}>El. paštas</div>
    <div className={styles.headerField}>Gimimo data</div>
    <div className={`${styles.headerField} ${styles.buttons}`}>Redaguoti | Ištrinti</div>
  </div>

  <div className={styles.userList}>
    {paginatedUsers.map((user) => (
      <div key={user.id} className={styles.userCard}>
        <div className={styles.userField}>{user.name}</div>
        <div className={styles.userField}>{user.email}</div>
        <div className={styles.userField}>{user.birth_date}</div>
        <div className={styles.userActions}>
          <button onClick={() => onEditUser(user)} className={styles.btnEdit}>
            <img src={editIcon} alt="Redaguoti" className={styles.icon} />
          </button>
          <button onClick={() => handleDelete(user.id!)} className={styles.btnDelete}>
            <img src={deleteIcon} alt="Ištrinti" className={styles.icon} />
          </button>
        </div>
      </div>
    ))}
  </div>

  <div className={styles.pagination}>
    <button onClick={handlePrevPage} disabled={page === 1}><img src={prev} alt="Atgal" className={styles.icon} /></button>
    <span>Puslapis {page} iš {totalPages}</span>
    <button onClick={handleNextPage} disabled={page === totalPages}><img src={next} alt="Kitas" className={styles.icon} /></button>
  </div>
</div>
</>
  );

};

export default UserList;
