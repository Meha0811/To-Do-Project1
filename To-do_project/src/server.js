const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");

const userRouter = require("./routes/user.route");
const taskRouter = require("./routes/task.route");
const progressRouter = require("./routes/progress.route");
const recurringTaskRouter = require("./routes/recurringtask.route");

// Init express
const app = express();

// Init environment
dotenv.config();

// Parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());
app.options("*", cors());

const port = Number(process.env.PORT || 3331);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/recurring", recurringTaskRouter);

// 404 handler
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});

// Global error middleware
app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

module.exports = app;
