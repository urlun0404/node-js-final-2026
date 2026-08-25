const db = require("../db");

async function findCreditPackageById(creditPackageId) {
  const result = await db.query(
    "SELECT id, name, credit_amount, price FROM packages WHERE id = $1",
    [creditPackageId],
  );
  return result.rows[0];
}

async function findAllCreditPackages() {
  const result = await db.query(
    "SELECT id, name, credit_amount, price FROM packages",
  );
  return result.rows;
}

async function saveNewCreditPackage(package) {
  const result = await db.query(
    "INSERT INTO packages (name, credit_amount, price) VALUES ($1, $2, $3) RETURNING *",
    [package.name, package.credit_amount, package.price],
  );
  return result.rows[0];
}

async function deleteCreditPackageById(packageId) {
  const result = await db.query(
    "DELETE FROM packages WHERE id = $1 RETURNING *",
    [packageId],
  );
  return { raw: result.rows, affected: result.rowCount };
}

module.exports = {
  findCreditPackageById,
  findAllCreditPackages,
  saveNewCreditPackage,
  deleteCreditPackageById,
};
