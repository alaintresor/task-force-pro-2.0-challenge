import { Router } from "express";
import { serve, setup } from "swagger-ui-express";

const docrouter = Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "Wallet App API",
    version: "1.0.0",
    description: "Wallet App API Documentation",
  },
  basePath: "/api",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Auth", description: "Auth" },
    { name: "Account", description: "Account" },
    { name: "Category", description: "Category" },
    { name: "SubCategory", description: "SubCategory" },
    { name: "Transaction", description: "Transaction" },
  ],
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        description: "Login a user",
        operationId: "loginUser",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              example: {
                email: "root@example.com",
                password: "root123",
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Add a user",
        description: "Add a user",
        operationId: "addOneUser",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              example: {
                username: "john doe",
                email: "test@example.com",
                password: "password",
                confirmPassword: "password",
              },
              required: true,
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/forgotPassword": {
      post: {
        tags: ["Auth"],
        summary: "Forgot password",
        description: "Forgot password",
        operationId: "forgotPassword",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              example: {
                email: "test@example.com",
              },
              required: true,
            },
          },
        },
        responses: {
          200: {
            description: "Password reset link sent to your email",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/resetPassword": {
      post: {
        tags: ["Auth"],
        summary: "Reset password",
        description: "Reset password",
        operationId: "resetPassword",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              example: {
                password: "password",
                confirmPassword: "password",
                token: "token",
              },
              required: true,
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/accounts": {
      post: {
        tags: ["Account"],
        summary: "Create account",
        description: "Create account",
        operationId: "createAccount",
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "BK",
                type: "bank",
                balance: 1000,
              },
              required: true,
            },
          },
        },
        responses: {
          201: {
            description: "Account created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      get: {
        tags: ["Account"],
        summary: "Get all accounts",
        description: "Get all accounts",
        operationId: "getAllAccounts",
        responses: {
          200: {
            description: "Accounts retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/accounts/{accountId}": {
      get: {
        tags: ["Account"],
        summary: "Get account by id",
        description: "Get account by id",
        operationId: "getAccountById",
        parameters: [
          {
            name: "accountId",
            in: "path",
            description: "Account id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Account retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      put: {
        tags: ["Account"],
        summary: "Update account",
        description: "Update account",
        operationId: "updateAccount",
        parameters: [
          {
            name: "accountId",
            in: "path",
            description: "Account id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "BK",
                type: "bank",
                balance: 1000,
              },
              required: true,
            },
          },
        },
        responses: {
          200: {
            description: "Account updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      delete: {
        tags: ["Account"],
        summary: "Delete account",
        description: "Delete account",
        operationId: "deleteAccount",
        parameters: [
          {
            name: "accountId",
            in: "path",
            description: "Account id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "Account deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories": {
      post: {
        tags: ["Category"],
        summary: "Create category",
        description: "Create category",
        operationId: "createCategory",
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "Food",
              },
              required: true,
            },
          },
        },
        responses: {
          201: {
            description: "Category created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      get: {
        tags: ["Category"],
        summary: "Get all categories",
        description: "Get all categories",
        operationId: "getAllCategories",
        responses: {
          200: {
            description: "Categories retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories/{categoryId}": {
      get: {
        tags: ["Category"],
        summary: "Get category by id",
        description: "Get category by id",
        operationId: "getCategoryById",
        parameters: [
          {
            name: "categoryId",
            in: "path",
            description: "Category id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Category retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      put: {
        tags: ["Category"],
        summary: "Update category",
        description: "Update category",
        operationId: "updateCategory",
        parameters: [
          {
            name: "categoryId",
            in: "path",
            description: "Category id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "Food",
              },
              required: true,
            },
          },
        },
        responses: {
          200: {
            description: "Category updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/subcategories": {
      post: {
        tags: ["SubCategory"],
        summary: "Create subcategory",
        description: "Create subcategory",
        operationId: "createSubCategory",
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "Burger",
                categoryId: "123",
              },
              required: true,
            },
          },
        },
        responses: {
          201: {
            description: "Subcategory created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      get: {
        tags: ["SubCategory"],
        summary: "Get all subcategories",
        description: "Get all subcategories",
        operationId: "getAllSubCategories",
        responses: {
          200: {
            description: "Subcategories retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/subcategories/{subCategoryId}": {
      get: {
        tags: ["SubCategory"],
        summary: "Get subcategory by id",
        description: "Get subcategory by id",
        operationId: "getSubCategoryById",
        parameters: [
          {
            name: "subCategoryId",
            in: "path",
            description: "Subcategory id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Subcategory retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      put: {
        tags: ["SubCategory"],
        summary: "Update subcategory",
        description: "Update subcategory",
        operationId: "updateSubCategory",
        parameters: [
          {
            name: "subCategoryId",
            in: "path",
            description: "Subcategory id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "Burger",
                categoryId: "123",
              },
              required: true,
            },
          },
        },
        responses: {
          200: {
            description: "Subcategory updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      delete: {
        tags: ["SubCategory"],
        summary: "Delete subcategory",
        description: "Delete subcategory",
        operationId: "deleteSubCategory",
        parameters: [
          {
            name: "subCategoryId",
            in: "path",
            description: "Subcategory id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "Subcategory deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/transactions": {
      post: {
        tags: ["Transaction"],
        summary: "Create transaction",
        description: "Create transaction",
        operationId: "createTransaction",
        requestBody: {
          content: {
            "application/json": {
              example: {
                amount: 100,
                type: "out",
                accountId: "123",
                subCategoryId: "123",
                description: "Bought a burger",
              },
              required: true,
            },
          },
        },
        responses: {
          201: {
            description: "Transaction created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      get: {
        tags: ["Transaction"],
        summary: "Get all transactions",
        description: "Get all transactions",
        operationId: "getAllTransactions",
        responses: {
          200: {
            description: "Transactions retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/transactions/{transactionId}": {
      get: {
        tags: ["Transaction"],
        summary: "Get transaction by id",
        description: "Get transaction by id",
        operationId: "getTransactionById",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            description: "Transaction id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Transaction retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      put: {
        tags: ["Transaction"],
        summary: "Update transaction",
        description: "Update transaction",
        operationId: "updateTransaction",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            description: "Transaction id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                amount: 100,
                type: "credit",
                accountId: "123",
              },
              required: true,
            },
          },
        },
        responses: {
          200: {
            description: "Transaction updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      delete: {
        tags: ["Transaction"],
        summary: "Delete transaction",
        description: "Delete transaction",
        operationId: "deleteTransaction",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            description: "Transaction id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "Transaction deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/transactions/report": {
      get: {
        tags: ["Transaction"],
        summary: "Get transaction report",
        description: "Get transaction report",
        operationId: "getTransactionReport",
        parameters: [
          {
            name: "startDate",
            in: "query",
            description: "Start date",
            schema: {
              type: "string",
            },
          },
          {
            name: "endDate",
            in: "query",
            description: "End date",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Transaction report retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/transactions/{accountId}/report": {
      get: {
        tags: ["Transaction"],
        summary: "Get transaction report by account",
        description: "Get transaction report by account",
        operationId: "getTransactionReportByAccount",
        parameters: [
          {
            name: "accountId",
            in: "path",
            description: "Account id",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "startDate",
            in: "query",
            description: "Start date",
            schema: {
              type: "string",
            },
          },
          {
            name: "endDate",
            in: "query",
            description: "End date",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Transaction report retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

docrouter.use("/", serve, setup(options));

export default docrouter;
