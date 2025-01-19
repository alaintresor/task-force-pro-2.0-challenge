import Transaction from "../models/Transaction";
import mongoose from "mongoose";

class TransactionService {
  async createTransaction(data) {
    try {
      const transaction = new Transaction(data);
      await transaction.save();
      return transaction;
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  }

  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findById(id).populate(
        "accountId subCategoryId"
      );
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      throw new Error(`Error fetching transaction: ${error.message}`);
    }
  }

  async updateTransaction(id, data) {
    try {
      const transaction = await Transaction.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  }

  async deleteTransaction(id) {
    try {
      const transaction = await Transaction.findByIdAndDelete(id);
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      throw new Error(`Error deleting transaction: ${error.message}`);
    }
  }

  async getAllTransactions() {
    try {
      const transactions = await Transaction.find().populate(
        "accountId categoryId subCategoryId"
      );
      return transactions;
    } catch (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
  }
  async getTransactionReport(userId, startDate = null, endDate = null) {
    try {
      const query = { userId };
      if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query.date = { $gte: startDate };
      } else if (endDate) {
        query.date = { $lte: endDate };
      }

      const transactions = await Transaction.find(query).populate(
        "accountId categoryId subCategoryId"
      );
      return transactions;
    } catch (error) {
      throw new Error(`Error fetching transaction report: ${error.message}`);
    }
  }
  async getTransactionReportByAccount(
    accountId,
    startDate = null,
    endDate = null
  ) {
    try {
      const query = { accountId };
      if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query.date = { $gte: startDate };
      } else if (endDate) {
        query.date = { $lte: endDate };
      }

      const transactions = await Transaction.find(query).populate(
        "accountId categoryId subCategoryId"
      );
      return transactions;
    } catch (error) {
      throw new Error(
        `Error fetching transaction report by account: ${error.message}`
      );
    }
  }
  async getTransactionReportByCategory(query) {
    try {
      const transactions = await Transaction.find(query).populate(
        "accountId categoryId subCategoryId"
      );
      return transactions;
    } catch (error) {
      console.log("error", error);
      throw new Error(
        `Error fetching transaction report by category: ${error.message}`
      );
    }
  }
}

export default new TransactionService();
