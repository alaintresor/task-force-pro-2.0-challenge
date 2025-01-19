import TransactionService from "../services/transactionService";
import AccountService from "../services/accountService";

class TransactionController {
  async createTransaction(req, res) {
    try {
      const account = await AccountService.getAccountById(req.body.accountId);
      if (!account) {
        return res.status(400).json({
          success: false,
          message: "Invalid account",
        });
      }
      let newMount = 0;
      let transaction = null;
      if (req.body.type == "income") {
        console.log("income ------<>----- ", req.body.type);
        transaction = await TransactionService.createTransaction(req.body);
        newMount = account.balance + req.body.amount;
        account.balance = newMount;
        await AccountService.updateAccount(req.body.accountId, account);
      } else {
        if (account.balance < req.body.amount) {
          return res.status(400).json({
            success: false,
            message: "Insufficient funds",
          });
        }
        transaction = await TransactionService.createTransaction(req.body);
        newMount = account.balance - req.body.amount;
        account.balance = newMount;
        await AccountService.updateAccount(req.body.accountId, account);
      }

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTransactionById(req, res) {
    try {
      const transaction = await TransactionService.getTransactionById(
        req.params.id
      );
      res.status(200).json(transaction);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateTransaction(req, res) {
    try {
      const transaction = await TransactionService.updateTransaction(
        req.params.id,
        req.body
      );
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteTransaction(req, res) {
    try {
      await TransactionService.deleteTransaction(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const transactions = await TransactionService.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getTransactionReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;
      const transactions = await TransactionService.getTransactionReport(
        userId,
        startDate,
        endDate
      );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTransactionReportByAccount(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const { accountId } = req.params;
      const transactions =
        await TransactionService.getTransactionReportByAccount(
          accountId,
          startDate,
          endDate
        );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getTransactionReportByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { startDate, endDate } = req.query;
      const query = { categoryId };

      if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query.date = { $gte: startDate };
      } else if (endDate) {
        query.date = { $lte: endDate };
      }

      const transactions = await TransactionService.getTransactionReportByCategory(query);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new TransactionController();
