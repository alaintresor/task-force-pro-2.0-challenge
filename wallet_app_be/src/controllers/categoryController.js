import CategoryService from "../services/categoryService";

class CategoryController {
  async createCategory(req, res) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await CategoryService.deleteCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new CategoryController();
