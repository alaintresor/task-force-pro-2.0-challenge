import Account from "../models/Account";

class AccountService {
  async createAccount(userId, accountData) {
    try {
      const account = new Account({ userId, ...accountData });
      await account.save();
      return account;
    } catch (error) {
      throw new Error(`Error creating account: ${error.message}`);
    }
  }

  async getAccountsByUser(userId) {
    try {
      return await Account.find({ userId });
    } catch (error) {
      throw new Error(`Error retrieving accounts: ${error.message}`);
    }
  }

  async getAccountById(accountId) {
    try {
      const account = await Account.findById(accountId);
      if (!account) throw new Error("Account not found");
      return account;
    } catch (error) {
      throw new Error(`Error retrieving account: ${error.message}`);
    }
  }

  async updateAccount(accountId, updateData) {
    try {
      const account = await Account.findByIdAndUpdate(
        accountId,
        { ...updateData },
        { new: true, runValidators: true }
      );
      if (!account) throw new Error("Account not found");
      return account;
    } catch (error) {
      throw new Error(`Error updating account: ${error.message}`);
    }
  }

  async deleteAccount(accountId) {
    try {
      const account = await Account.findByIdAndDelete(accountId);
      if (!account) throw new Error("Account not found");
      return account;
    } catch (error) {
      throw new Error(`Error deleting account: ${error.message}`);
    }
  }
}

export default new AccountService();
