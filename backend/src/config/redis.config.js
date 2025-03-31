const { createClient } = require("redis");

// Khởi tạo redisClient
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

// Lắng nghe sự kiện redis
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

// Hàm kết nối redis
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  } else {
    console.log("Redis socket already opened");
  }
};

module.exports = { redisClient, connectRedis };
