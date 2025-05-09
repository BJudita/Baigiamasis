import db from "../db/db.js";

export async function createUser(name, email, birth_date) {
  const result = await db.query(
    `INSERT INTO event_users (name, email, birth_date)
     VALUES ($1, $2, $3)
     RETURNING *`, 
    [name, email, birth_date]
  );
  return result.rows[0];
}

export async function getAllUsers() {
    const result = await db.query(`SELECT * FROM event_users ORDER BY id ASC`);
    return result.rows;
  }
  
export async function getUserByEmail(email) {
    const result = await db.query(
      `SELECT * FROM event_users WHERE email = $1`,
      [email]
    );
    return result.rows[0];  
  }

  export async function updateUser(id, name, email, birth_date) {
    const result = await db.query(
      `UPDATE event_users
       SET name = $1, email = $2, birth_date = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [name, email, birth_date, id]
    );
    return result.rows[0];
  }

  export async function deleteUser(id) {
    const result = await db.query(
      `DELETE FROM event_users WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0]; 
  }
