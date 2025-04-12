const natural = require("natural");
const fs = require("fs");
const path = require("path");

// Load pre-verified claims database
const CLAIMS_DB_PATH = path.join(__dirname, "../data/claims.json");
let claimsDB = [];

try {
  claimsDB = JSON.parse(fs.readFileSync(CLAIMS_DB_PATH));
} catch (err) {
  console.error("🚫 Error loading claims DB:", err);
}

class OfflineCheckService {
  static searchClaims(query) {
    const tokenizer = new natural.WordTokenizer();
    const queryTokens = tokenizer.tokenize(query.toLowerCase());

    return claimsDB
      .filter((claim) => {
        // Basic keyword matching
        const claimTokens = tokenizer.tokenize(claim.text.toLowerCase());
        const intersection = queryTokens.filter((t) => claimTokens.includes(t));

        // Match threshold and expected to return 3 matches
        return intersection.length >= Math.max(2, queryTokens.length * 0.3);
      })
      .slice(0, 3);
  }

  static async updateDatabase(newClaims) {
    claimsDB = [...new Set([...claimsDB, ...newClaims])];
    fs.writeFileSync(CLAIMS_DB_PATH, JSON.stringify(claimsDB));
  }
}

module.exports = OfflineCheckService;
