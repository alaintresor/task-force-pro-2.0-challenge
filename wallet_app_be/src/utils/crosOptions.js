const allowedOriginsList = ["http://localhost:3000"];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOriginsList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
