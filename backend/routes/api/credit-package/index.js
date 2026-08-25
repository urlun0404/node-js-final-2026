const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middlewares/auth");
const {
  saveNewBookingCreditPackage,
} = require("../../../repositories/booking");
const {
  findCreditPackageById,
  deleteCreditPackageById,
  findAllCreditPackages,
  saveNewCreditPackage,
} = require("../../../repositories/credit-package");
const { isValidNumber } = require("../../../utils/validation");
const { hasDuplicateData } = require("../helpers");

// 取得購買方案列表
router.get("/", async (req, res) => {
  try {
    const creditPackages = await findAllCreditPackages();
    res.status(200).json({ status: "success", data: creditPackages });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "取得資料失敗，請稍候再試。" });
  }
});

// 新增購買方案
router.post("/", async (req, res) => {
  const payload = req.body;

  const name = payload.name?.trim();
  const { credit_amount, price } = payload;
  if (!name || !isValidNumber(credit_amount) || !isValidNumber(price)) {
    return res
      .status(400)
      .json({ status: "failed", message: "欄位未填寫正確" });
  }

  try {
    const existingCreditPackages = await findAllCreditPackages();
    if (existingCreditPackages.some((pkg) => pkg.name === name)) {
      return res.status(409).json({ status: "failed", message: "資料重複" });
    }

    const newCreditPackage = { name, credit_amount, price };
    const savedCreditPackage = await saveNewCreditPackage(newCreditPackage);

    res.status(201).json({ status: "success", data: savedCreditPackage });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "新增資料失敗，請稍候再試。" });
  }
});

// 刪除購買方案
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: "failed", message: "ID 為必填欄位。" });
  }

  try {
    const result = await deleteCreditPackageById(id);
    if (result.affected === 0) {
      return res.status(404).json({ status: "failed", message: "ID錯誤" });
    }

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "刪除資料失敗，請稍候再試。" });
  }
});

// 購買堂數方案 M5
router.post("/:creditPackageId", authMiddleware, async (req, res) => {
  const { creditPackageId } = req.params;
  const foundCreditPacklage = await findCreditPackageById(creditPackageId);
  if (!foundCreditPacklage) {
    return res.status(400).json({ status: "failed", message: "ID錯誤" });
  }
  const newBooking = await saveNewBookingCreditPackage(
    req.user.id,
    foundCreditPacklage,
  );
  if (!newBooking) {
    return res
      .status(500)
      .json({ status: "failed", message: "資料更新失敗，請稍候再試。" });
  }
  res.status(200).json({ status: "success", data: null });
});

module.exports = router;
