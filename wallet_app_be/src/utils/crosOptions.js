const allowedOriginsList = [
  "http://localhost:3000",
  "https://task-force-pro-2-0-challenge.vercel.app",
];

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
