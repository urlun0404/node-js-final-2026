const db = require("../db");

const data = [
  {
    id: "0d2c1b3a-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
    name: "7 堂組合包方案",
    credit_amount: 7,
    price: 1400,
    createdAt: "2026-06-10T08:00:00.000Z",
  },
  {
    id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    name: "14 堂組合包方案",
    credit_amount: 14,
    price: 2800,
    createdAt: "2026-06-10T08:00:00.000Z",
  },
];

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
  findAllCreditPackages,
  saveNewCreditPackage,
  deleteCreditPackageById,
};
