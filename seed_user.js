const db = require("./models");
const bcrypt = require("bcrypt");

async function createDefaultUser() {
  try {
    await db.sequelize.sync();

    const username = "demo";
    const password = "demo123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      username: username,
      password: hashedPassword,
      fullName: "Demo User",
      role: "ROLE_ADMIN", // Assuming you want an admin user
      active: true,
    });

    console.log("Default user created successfully!");
    console.log("Username:", user.username);
    //console.log("Password:", password);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log("User 'demo' already exists.");
    } else {
      console.error("Error creating user:", error);
    }
  } finally {
    await db.sequelize.close();
  }
}

createDefaultUser();
