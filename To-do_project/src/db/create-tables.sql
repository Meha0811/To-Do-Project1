-- =========================
-- 1. USER TABLE
-- =========================
CREATE TABLE user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

-- =========================
-- 2. CATEGORY TABLE
-- =========================
CREATE TABLE category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  color_code VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- =========================
-- 3. TASK TABLE
-- =========================
CREATE TABLE task (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
  due_date DATETIME NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  color_tag VARCHAR(20),
  repeat_pattern ENUM('None', 'Daily', 'Weekly', 'Monthly') DEFAULT 'None',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL
);

-- =========================
-- 4. REMINDER TABLE
-- =========================
CREATE TABLE reminder (
  reminder_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  reminder_time DATETIME NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE
);

-- =========================
-- 5. PROGRESS TABLE
-- =========================
CREATE TABLE progress (
  progress_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  recurring_instance_date DATE DEFAULT NULL,
  progress_percentage INT CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE
);

-- =========================
-- 6. RECURRING TASK TABLE
-- =========================
CREATE TABLE recurring_task (
  recurring_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  pattern ENUM('Daily', 'Weekly', 'Monthly') NOT NULL,
  next_occurence DATETIME NOT NULL,
  FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE
);

-- =========================
-- 7. RECURRING TASK EXCEPTIONS TABLE
-- =========================
CREATE TABLE recurring_task_exceptions (
  exception_id INT AUTO_INCREMENT PRIMARY KEY,
  recurring_task_id INT NOT NULL,
  exception_date DATE NOT NULL,
  reason VARCHAR(255),
  FOREIGN KEY (recurring_task_id) REFERENCES recurring_task(recurring_id) ON DELETE CASCADE
);
