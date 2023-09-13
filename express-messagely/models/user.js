/** User class for message.ly */



/** User of the site. */

class User {

    constructor({
      id, username, password, first_name, last_name, phone
    }){  
      this.id = id;
      this.username = username;
      this.password = password;
      this.first_name = first_name;
      this.last_name = last_name;
      this.phone = phone;
    }

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  static async register({username, password, first_name, last_name, phone}) { 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await db.query(
      `
      INSERT INTO users (username, password, first_name, last_name, phone, join_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING username, first_name, last_name, phone;
      `,
      [username, hashedPassword, first_name, last_name, phone]
    );

    return result.rows[0];
  }

  

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
  // Retrieve the user from the database by username
    const result = await db.query(
    `
    SELECT username, password
    FROM users
    WHERE username = $1;
    `,
    [username]
  );

  if (result.rows.length === 0) {
    return false; // User not found
  }

  const user = result.rows[0];

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  return passwordMatch;
  }

    

    /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    await db.query(
      `
      UPDATE users
      SET last_login_at = NOW()
      WHERE username = $1;
      `,
      [username]
    );
  }

  
  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const result = await db.query(
      `
      SELECT username, first_name, last_name, phone
      FROM users;
      `
    );

    return result.rows;
   }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    const result = await db.query(
      `
      SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1;
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return null; // User not found
    }

    return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(
      `
      SELECT m.id, m.body, m.sent_at, m.read_at, u.username, u.first_name, u.last_name, u.phone
      FROM messages m
      JOIN users u ON m.to_username = u.username
      WHERE m.from_username = $1;
      `,
      [username]
    );

    return result.rows;
   }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(
      `
      SELECT m.id, m.body, m.sent_at, m.read_at, u.username, u.first_name, u.last_name, u.phone
      FROM messages m
      JOIN users u ON m.from_username = u.username
      WHERE m.to_username = $1;
      `,
      [username]
    );

    return result.rows;
   }
}


module.exports = User;