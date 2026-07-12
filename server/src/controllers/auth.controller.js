const bcrypt = require('bcryptjs');
const validator = require('validator');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const { ROLES } = require('../utils/constants');

/**
 * Register a new employee user.
 */
const signup = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Validation
    if (!full_name || !email || !password) {
      return error(res, 'Please fill in all registration fields.', 400);
    }

    if (!validator.isEmail(email)) {
      return error(res, 'Please enter a valid email address.', 400);
    }

    if (password.length < 6) {
      return error(res, 'Password must be at least 6 characters.', 400);
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return error(res, 'An account with this email address already exists.', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Odoo Compliance: Always registers new users with EMPLOYEE role
    const defaultRole = ROLES.EMPLOYEE;
    const defaultOrg = 'org_admin_flow';
    const defaultTenant = 'ten_main_flow';

    await pool.query(
      `INSERT INTO users (full_name, email, password, role, is_active, organization_id, tenant_id) 
       VALUES (?, ?, ?, ?, TRUE, ?, ?)`,
      [full_name.trim(), email.toLowerCase().trim(), hashedPassword, defaultRole, defaultOrg, defaultTenant]
    );

    return success(res, 'Employee account created successfully.', {}, 201);
  } catch (err) {
    console.error('Signup controller error:', err.message);
    return error(res, 'Registration failed due to a system error.');
  }
};

/**
 * Authenticate user and issue JWT.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Please enter email and password.', 400);
    }

    // Fetch user
    const [rows] = await pool.query(
      'SELECT id, full_name, email, password, role, is_active, organization_id, tenant_id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return error(res, 'Invalid email address or password.', 401);
    }

    const user = rows[0];

    // Check if user account is deactivated
    if (!user.is_active) {
      return error(res, 'Your account has been deactivated. Please contact an Administrator.', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return error(res, 'Invalid email address or password.', 401);
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
      tenant_id: user.tenant_id
    });

    // Delete password hash from response user object
    delete user.password;

    return success(res, 'Login successful', { user, token });
  } catch (err) {
    console.error('Login controller error:', err.message);
    return error(res, 'Authentication failed due to a system error.');
  }
};

module.exports = {
  signup,
  login,
};
