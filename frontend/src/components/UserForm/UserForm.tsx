import React, { useState, useEffect } from "react";
import { createUser, updateUser } from "../../api/userApi";
import styles from "./UserForm.module.css";
import type { User } from "../../types/User";
import { AxiosError } from "axios";

interface Props {
  onUserCreated: () => void;
  userToEdit?: User | null;
  onCancelEdit?: () => void;
}

const UserForm: React.FC<Props> = ({
  onUserCreated,
  userToEdit,
  onCancelEdit,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setBirthDate(userToEdit.birth_date.toString().substring(0, 10));
    } else {
      setName("");
      setEmail("");
      setBirthDate("");
    }
    setErrorMessage(null);
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let userData: { name: string; email: string; birth_date: string | number } =
      {
        name,
        email,
        birth_date: "",
      };

    const trimmedBirthDate = birthDate.trim();
    console.log("Trimmed birthDate:", trimmedBirthDate);

    if (trimmedBirthDate && Date.parse(trimmedBirthDate)) {
      // If the input is a valid date string (e.g., 1999-02-02)
      console.log("Valid date:", trimmedBirthDate);
      userData = { ...userData, birth_date: trimmedBirthDate }; // Pass the date directly
    } else if (trimmedBirthDate && !isNaN(Number(trimmedBirthDate))) {
      // If the input is a valid number (e.g., 20 for age)
      console.log("Valid age:", trimmedBirthDate);
      userData = { ...userData, birth_date: Number(trimmedBirthDate) }; // Send age as a number
    } else {
      console.log("Invalid input");
      setErrorMessage("Įveskite galiojantį amžių arba gimimo datą.");
      return;
    }

    console.log("User data to send:", userData); // Log the final userData

    try {
      if (userToEdit) {
        // Update user logic
        await updateUser(userToEdit.id!, userData);
      } else {
        // Create new user logic
        await createUser(userData);
      }

      setName("");
      setEmail("");
      setBirthDate("");
      setErrorMessage(null);
      setSuccessMessage(
        userToEdit
          ? "Vartotojas atnaujintas!"
          : "Vartotojas sukurtas sėkmingai!"
      );
      onUserCreated();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
  if (err instanceof AxiosError && err.response) {
    setErrorMessage(
      err.response.data?.error || "Nepavyko pridėti vartotojo."
    );
  } else {
    setErrorMessage("Įvyko klaida. Bandykite vėl.");
  }
}
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>
        {userToEdit ? "Redaguojamas vartotojas" : "Vartotojo registracija"}
      </h2>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}

      <label htmlFor="name">Pilnas vardas</label>
      <input
        id="name"
        placeholder="Jonas Jonaitis"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="email">El. pašto adresas</label>
      <input
        id="email"
        placeholder="pavyzdys@gmail.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="birthDate">Amžius</label>
      <input
        id="birthDate"
        placeholder="20"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        required
      />

      <button type="submit">{userToEdit ? "Atnaujinti" : "Sukurti"}</button>
      {userToEdit && (
        <button
          type="button"
          onClick={onCancelEdit}
          className={styles.cancelBtn}
        >
          {" "}
          Atšaukti{" "}
        </button>
      )}
    </form>
  );
};

export default UserForm;
