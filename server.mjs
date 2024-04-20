import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg"; // Use import for pg module

const { Pool } = pg; // Use destructuring assignment to get Pool from pg
import open from "open";

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// PostgreSQL configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the home.html as the default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Route to handle inserting time into database for creative games
app.post("/insert-creative-time", async (req, res) => {
  try {
    const { timeTaken } = req.body;
    // Connect to the database
    const client = await pool.connect();
    try {
      // Start a transaction
      await client.query("BEGIN");

      // Delete all previous records
      await client.query("DELETE FROM creativegames");

      // Insert the new record
      await client.query("INSERT INTO creativegames (time) VALUES ($1)", [
        timeTaken,
      ]);

      // Commit the transaction
      await client.query("COMMIT");

      res
        .status(200)
        .send("Time taken for creative game inserted into database");
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query("ROLLBACK");
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error(
      "Error inserting time taken for creative game into database:",
      err
    );
    res.status(500).send("Internal Server Error");
  }
});

// Route to handle inserting time into database for logical games
app.post("/insert-logical-time", async (req, res) => {
  try {
    const { timeTaken } = req.body;
    // Connect to the database
    const client = await pool.connect();
    try {
      // Start a transaction
      await client.query("BEGIN");

      // Delete all previous records
      await client.query("DELETE FROM logicalgames");

      // Insert the new record
      await client.query("INSERT INTO logicalgames (time) VALUES ($1)", [
        timeTaken,
      ]);

      // Commit the transaction
      await client.query("COMMIT");

      res
        .status(200)
        .send("Time taken for logical game inserted into database");
    } catch (err) {
      // Rollback the transaction if an error occurs
      await client.query("ROLLBACK");
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error(
      "Error inserting time taken for logical game into database:",
      err
    );
    res.status(500).send("Internal Server Error");
  }
});

// Route to compare times of logical and creative games and determine user's mindset
// Route to compare the times of logical and creative games and determine the user's mindset
app.get("/compare-times", async (req, res) => {
  try {
    // Connect to the database
    const client = await pool.connect();

    try {
      // Query to get the time taken for logical game
      const logicalResult = await client.query("SELECT time FROM logicalgames");
      const logicalTimeStr = logicalResult.rows[0].time;
      const [logicalMinutes, logicalSeconds] = logicalTimeStr
        .split(":")
        .map(Number); // Parse minutes and seconds

      // Query to get the time taken for creative game
      const creativeResult = await client.query(
        "SELECT time FROM creativegames"
      );
      const creativeTimeStr = creativeResult.rows[0].time;
      const [creativeMinutes, creativeSeconds] = creativeTimeStr
        .split(":")
        .map(Number); // Parse minutes and seconds

      // Convert minutes and seconds to total seconds
      const logicalTotalSeconds = logicalMinutes * 60 + logicalSeconds;
      const creativeTotalSeconds = creativeMinutes * 60 + creativeSeconds;

      // Compare the times and determine the user's mindset
      const mindset =
        logicalTotalSeconds < creativeTotalSeconds ? "logical" : "creative";
      // Send the comparison result and the user's mindset as a JSON response
      res
        .status(200)
        .json({ logicalTotalSeconds, creativeTotalSeconds, mindset });
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error("Error comparing times:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`); // Automatically open the browser
});
