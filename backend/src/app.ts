// Patches
import { inject, errorHandler } from "express-custom-error";
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
import env from "mandatoryenv";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

// Add Modules
import logger from "@utils/logger";
import router from "@routes/index";

// Load .env Enviroment Variables to process.env
env.load([
    'MONGODB_URL',
    'PORT',
    'JWT_SECRET',
    'COOKIE_SECRET',
    'OPEN_AI_SECRET',
    'OPEN_AI_ORGANIZATION_ID'
]);

// Instantiate an Express Application
const app = express();


// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(morgan('dev'));
app.use(cors( { origin: "http://localhost:5173", credentials: true } ));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(helmet());

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

// Assign Routes
app.use('/', router);
app.use('/api/v1', router);

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
});

export default app;