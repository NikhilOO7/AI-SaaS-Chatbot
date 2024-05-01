// Import Modules
import app from "./app";
import { connectToDatabase } from "@db/connection";


const { PORT } = process.env;

// Open Server on configurated Port
connectToDatabase().then(() => {
    app.listen(
        PORT,
        () => console.info('Server listening on port ', PORT)
    );
}).catch(error => console.log(error));