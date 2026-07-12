const { pool } = require('../config/db');

/**
 * Initialize organization tables on app startup if they do not exist.
 * This guarantees smooth functionality without requiring manual database migration runs.
 */
const initTables = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Create departments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS departments (
        department_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(150) NOT NULL UNIQUE,
        parent_department_id BIGINT UNSIGNED DEFAULT NULL,
        department_head_id INT DEFAULT NULL,
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_dept_parent FOREIGN KEY (parent_department_id) REFERENCES departments(department_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_dept_head FOREIGN KEY (department_head_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    // 2. Create asset_categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS asset_categories (
        category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    // 3. Ensure users table has department_id for relation support
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'department_id'
    `);

    if (columns.length === 0) {
      try {
        await connection.query(`
          ALTER TABLE users ADD COLUMN department_id BIGINT UNSIGNED DEFAULT NULL
        `);
        await connection.query(`
          ALTER TABLE users ADD CONSTRAINT fk_users_department_id 
          FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL ON UPDATE CASCADE
        `);
        console.log('Successfully added department_id column relation to users table.');
      } catch (alterErr) {
        console.warn('Could not add department_id to users:', alterErr.message);
      }
    }
  } catch (err) {
    console.error('Failed to initialize organization tables:', err.message);
  } finally {
    if (connection) connection.release();
  }
};
// Note: initTables is exported and called dynamically after db initialization

/**
 * Create a new department.
 */
const createDepartment = async (name, parentId, headId, description) => {
  const [result] = await pool.query(
    `INSERT INTO departments (department_name, parent_department_id, department_head_id, description, is_active)
     VALUES (?, ?, ?, ?, 1)`,
    [name.trim(), parentId || null, headId || null, description ? description.trim() : null]
  );

  const deptId = result.insertId;

  // If a department head is assigned, sync user details
  if (headId) {
    await pool.query(
      `UPDATE users SET role = 'DEPARTMENT_HEAD', department_id = ?, department = ? WHERE id = ?`,
      [deptId, name.trim(), headId]
    );
  }

  return {
    department_id: deptId,
    department_name: name.trim(),
    parent_department_id: parentId || null,
    department_head_id: headId || null,
    description: description || null,
    is_active: 1
  };
};

/**
 * Update department parameters.
 */
const updateDepartment = async (id, { name, parentId, headId, description, isActive }) => {
  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push('department_name = ?');
    params.push(name.trim());
  }
  if (parentId !== undefined) {
    fields.push('parent_department_id = ?');
    params.push(parentId || null);
  }
  if (headId !== undefined) {
    fields.push('department_head_id = ?');
    params.push(headId || null);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    params.push(description ? description.trim() : null);
  }
  if (isActive !== undefined) {
    fields.push('is_active = ?');
    params.push(isActive ? 1 : 0);
  }

  if (fields.length === 0) return null;

  params.push(id);
  await pool.query(`UPDATE departments SET ${fields.join(', ')} WHERE department_id = ?`, params);

  // If headId is assigned, upgrade user role to DEPARTMENT_HEAD and sync department fields
  if (headId) {
    const deptName = name || await getDepartmentName(id);
    await pool.query(
      `UPDATE users SET role = 'DEPARTMENT_HEAD', department_id = ?, department = ? WHERE id = ?`,
      [id, deptName, headId]
    );
  }

  return { id };
};

/**
 * Helper to fetch department name by ID.
 */
const getDepartmentName = async (id) => {
  const [rows] = await pool.query('SELECT department_name FROM departments WHERE department_id = ?', [id]);
  return rows.length > 0 ? rows[0].department_name : null;
};

/**
 * Deactivate a department.
 */
const deactivateDepartment = async (id) => {
  await pool.query('UPDATE departments SET is_active = 0 WHERE department_id = ?', [id]);
  return { id };
};

/**
 * Fetch all departments with headcount and manager names.
 */
const listDepartments = async () => {
  const query = `
    SELECT 
      d.department_id,
      d.department_name,
      d.parent_department_id,
      d.department_head_id,
      d.description,
      d.is_active,
      u.full_name AS department_head_name,
      (SELECT COUNT(*) FROM users u2 WHERE u2.department_id = d.department_id OR u2.department = d.department_name) AS headcount
    FROM departments d
    LEFT JOIN users u ON d.department_head_id = u.id
    ORDER BY d.department_name ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Create a new asset category.
 */
const createCategory = async (name, description) => {
  const [result] = await pool.query(
    `INSERT INTO asset_categories (category_name, description, is_active) VALUES (?, ?, 1)`,
    [name.trim(), description ? description.trim() : null]
  );
  return {
    category_id: result.insertId,
    category_name: name.trim(),
    description: description || null,
    is_active: 1
  };
};

/**
 * Update asset category parameters.
 */
const updateCategory = async (id, { name, description, isActive }) => {
  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push('category_name = ?');
    params.push(name.trim());
  }
  if (description !== undefined) {
    fields.push('description = ?');
    params.push(description ? description.trim() : null);
  }
  if (isActive !== undefined) {
    fields.push('is_active = ?');
    params.push(isActive ? 1 : 0);
  }

  if (fields.length === 0) return null;

  params.push(id);
  await pool.query(`UPDATE asset_categories SET ${fields.join(', ')} WHERE category_id = ?`, params);
  return { id };
};

/**
 * List all asset categories.
 */
const listCategories = async () => {
  const [rows] = await pool.query(
    'SELECT category_id, category_name, description, is_active, created_at FROM asset_categories ORDER BY category_name ASC'
  );
  return rows;
};

/**
 * Fetch employee directory with search and department filtering.
 */
const listEmployees = async (search, role, departmentId) => {
  let query = `
    SELECT 
      u.id,
      u.full_name,
      u.email,
      u.role,
      u.is_active,
      u.department,
      u.department_id,
      d.department_name,
      u.created_at
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.department_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ' AND (u.full_name LIKE ? OR u.email LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }

  if (role) {
    query += ' AND u.role = ?';
    params.push(role);
  }

  if (departmentId) {
    query += ' AND (u.department_id = ? OR d.department_name = ?)';
    params.push(departmentId, departmentId);
  }

  query += ' ORDER BY u.full_name ASC';
  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Promote employee user to a new elevated role.
 */
const promoteEmployee = async (id, role, departmentId) => {
  const fields = ['role = ?'];
  const params = [role];

  if (departmentId !== undefined) {
    fields.push('department_id = ?');
    params.push(departmentId || null);

    if (departmentId) {
      const deptName = await getDepartmentName(departmentId);
      if (deptName) {
        fields.push('department = ?');
        params.push(deptName);
      }
    } else {
      fields.push('department = NULL');
    }
  }

  params.push(id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);

  // If role is DEPARTMENT_HEAD and departmentId is specified, update the department model manager FK
  if (role === 'DEPARTMENT_HEAD' && departmentId) {
    await pool.query(
      'UPDATE departments SET department_head_id = ? WHERE department_id = ?',
      [id, departmentId]
    );
  }

  return { id };
};

/**
 * Demote employee user back to EMPLOYEE role.
 */
const demoteEmployee = async (id) => {
  await pool.query(`UPDATE users SET role = 'EMPLOYEE' WHERE id = ?`, [id]);
  // Nullify manager reference in departments table
  await pool.query('UPDATE departments SET department_head_id = NULL WHERE department_head_id = ?', [id]);
  return { id };
};

module.exports = {
  initTables,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
  listDepartments,
  createCategory,
  updateCategory,
  listCategories,
  listEmployees,
  promoteEmployee,
  demoteEmployee
};
