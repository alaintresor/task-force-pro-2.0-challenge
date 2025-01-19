import AccountService from "../services/accountService";

class AccountController {
  static async createAccount(req, res) {
    try {
      const { user } = req;
      const account = await AccountService.createAccount(user.id, req.body);
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAccountsByUser(req, res) {
    try {
      const { user } = req;
      const accounts = await AccountService.getAccountsByUser(user.id);
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAccountById(req, res) {
    try {
      const { accountId } = req.params;
      const account = await AccountService.getAccountById(accountId);
      res.status(200).json(account);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateAccount(req, res) {
    try {
      const { accountId } = req.params;
      const updateData = req.body;
      const account = await AccountService.updateAccount(accountId, updateData);
      res.status(200).json(account);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { accountId } = req.params;
      await AccountService.deleteAccount(accountId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AccountController;
