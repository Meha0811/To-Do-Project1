-- USER TABLE
CREATE TABLE user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

-- CATEGORY TABLE
CREATE TABLE category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  color_code VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- TASK TABLE
CREATE TABLE task (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  description TEXT,
  category_id INT,
  priority ENUM('Low', 'Medium', 'High'),
  due_date DATETIME,
  is_completed BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  color_tag VARCHAR(20),
  repeat_pattern ENUM('None', 'Daily', 'Weekly', 'Monthly'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- REMINDER TABLE
CREATE TABLE reminder (
  reminder_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  reminder_time DATETIME,
  is_sent BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE
);

-- PROGRESS TABLE
CREATE TABLE progress (
  progress_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  progress_percentage INT CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE
);

-- RECURRING TASK TABLE
CREATE TABLE recurring_task (
  recurring_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  pattern ENUM('Daily', 'Weekly', 'Monthly'),
  next_occurence DATETIME,
  FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE
);
