import { createUser, getAllUsers, getUserByEmail, updateUser, deleteUser } from "../models/userModel.js";

export async function handleCreateUser(req, res) {
  try {
    const { name, email, birth_date } = req.body;

    if (!name || !email || !birth_date) {
      return res.status(400).json({
        success: false,
        message: "Vardas, el. paštas ir gimimo data yra privalomi.",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Šis el. paštas jau egzistuoja.",
      });
    }

    const newUser = await createUser(name, email, birth_date);

    return res.status(201).json({
      success: true,
      user: {
        ...newUser,
        birth_date: newUser.birth_date.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("Klaida kuriant vartotoją:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Klaida kuriant vartotoją. Bandykite iš naujo.",
      });
    }
  }
}

export async function handleGetAllUsers(req, res) {
  try {
    const users = await getAllUsers();
    const formattedUsers = users.map((user) => ({
      ...user,
      birth_date: user.birth_date.toLocaleDateString("sv-SE"),
    }));
    res.status(200).json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error("Klaida gaunant vartotojus:", error);
    res
      .status(500)
      .json({ success: false, message: "Klaida gaunant vartotojus." });
  }
}

export async function handleUpdateUser(req, res) {
  const { id } = req.params;
  const { name, email, birth_date } = req.body;
  try {
    if (!name || !email || !birth_date) {
      return res.status(400).json({
        success: false,
        message: "Vardas, el. paštas, ir Gimimo data yra privaloma.",
      });
    }

    let parsedBirthDate = birth_date;
    if (typeof birth_date === "number") {
      const birthYear = new Date().getFullYear() - birth_date;
      parsedBirthDate = `${birthYear}-01-01`;
    }

    const updatedUser = await updateUser(id, name, email, parsedBirthDate);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: `Vartotojas su šiuo ${id} nerastas` });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Klaida atnaujinant vartotoją:", error);
    res.status(500).json({
      success: false,
      message: "Klaida atnaujinant vartotoją. Bandykite iš naujo.",
    });
  }
}

export async function handleDeleteUser(req, res) {
  const { id } = req.params;
  try {
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: `Vartotojas us šiuo ${id} nerastas` });
    }
    res
      .status(200)
      .json({ success: true, message: "Vartotojas ištrintas sėkmingai." });
  } catch (error) {
    console.error("Klaida šalinant vartotoją:", error);
    res.status(500).json({
      success: false,
      message: "Klaida šalinant vartotoją. Bandykite iš naujo",
    });
  }
}
