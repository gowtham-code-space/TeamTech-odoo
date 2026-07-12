/**
 * Paginates records for database query response.
 */
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

/**
 * Formats database select count results.
 */
const getPagingData = (data, page, limit) => {
  const { count, rows } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(count / limit);
  return { totalItems: count, rows, totalPages, currentPage };
};

module.exports = {
  getPagination,
  getPagingData
};
