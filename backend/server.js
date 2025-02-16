const express = require("express");
const mysql2 = require("mysql2/promise");

// Classe de gestion de la base de données
class Database {
  constructor(config) {
    this.config = config;
    this.pool = mysql.createPool(this.config);
  }

  async query(sql, params) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("Erreur SQL:", error);
      throw error;
    }
  }
}

// Classe de gestion des routes
class API {
  constructor(database) {
    this.database = database;
    this.router = express.Router();
    this.setupRoutes();
  }
  //   route pour récuppérer les données
  setupRoutes() {
    this.router.get("/getdata", async (req, res) => {
      try {
        const data = await this.database.query("SELECT * FROM credentials");
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    //   route pour insérer les données
    this.router.post("/setdata", async (req, res) => {
      console.log(req);
      try {
        const { nom, prenom } = req.body;

        if (!nom || !prenom) {
          return res
            .status(400)
            .json({ error: "Tous les champs sont requis." });
        }

        const sql = "INSERT INTO credentials (nom, prenom) VALUES (?, ?)";
        await this.database.query(sql, [nom, prenom]);

        res.json({ message: "Données insérées avec succès" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
}

// Initialisation de l'application
async function main() {
  const dbConfig = {
    host: "localhost",
    user: "js_user",
    password: "jsuser",
    database: "jsdb",
  };

  const db = new Database(dbConfig);
  const api = new API(db);
  const app = express();

  app.use(express.json()); // IMPORTANT : Active le parsing JSON
  app.use(cors()); // Active CORS pour toutes les requêtes

  app.use("/api", api.router);

  const PORT = 50000;

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

main().catch((err) =>
  console.error("Erreur lors du démarrage de l'application:", err)
);
