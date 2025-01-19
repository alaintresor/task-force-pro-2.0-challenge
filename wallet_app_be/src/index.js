import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 4000;

try {
  app.listen(port, () => {
    console.log(`server running on port ${port} `);
  });
} catch (error) {
  console.log(error);
}

