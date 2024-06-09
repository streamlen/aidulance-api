import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import appContants from "./constants/app";
import errorHandler from "./controllers/errorHandler";
import pool from "./config/db";
import rateLimiter from "./utils/ratelimiter/ratelimiting";

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.use(
	rateLimiter({
		limit: 10,
		windowMS: 5 * 60 * 1000, // 5 minutes
	})
);

app.use(`/v${appContants.VERSION}`, userRoutes);
app.use(`/v${appContants.VERSION}/auth`, authRoutes);

app.get(`/v${appContants.VERSION}/database-check`, async (req, res) => {
	try {
		const data = await pool.query("select * from test");
		console.log(data);
		res.status(200).json({
			status: "success",
			message: "DB working fine",
		});
	} catch (err) {
		console.log(err);
	}
});

app.all("*", (req, res) => {
	res.status(404).json({
		status: "error",
		message: "Resourse not found",
	});
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});
