import SubCategoryService from '../services/subCategoryService';

class SubCategoryController {
    async createSubCategory(req, res) {
        try {
            const subCategory = await SubCategoryService.createSubCategory(req.body);
            res.status(201).json(subCategory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSubCategoryById(req, res) {
        try {
            const subCategory = await SubCategoryService.getSubCategoryById(req.params.id);
            res.status(200).json(subCategory);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async getAllSubCategories(req, res) {
        try {
            const subCategories = await SubCategoryService.getAllSubCategories();
            res.status(200).json(subCategories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateSubCategory(req, res) {
        try {
            const subCategory = await SubCategoryService.updateSubCategory(req.params.id, req.body);
            res.status(200).json(subCategory);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async deleteSubCategory(req, res) {
        try {
            await SubCategoryService.deleteSubCategory(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new SubCategoryController();