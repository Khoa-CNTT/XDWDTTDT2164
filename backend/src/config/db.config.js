const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// Lấy thông tin từ biến môi trường
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;

// Kết nối sequelize với MySQL
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  logging: false,
});

// Hàm kiểm tra kết nối DB
const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectionDatabase;
