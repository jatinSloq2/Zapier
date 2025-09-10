import fs from "fs";
import fetch from "node-fetch";
import app from "../index.js";

const z = {
  request: async (options) => {
    const res = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    });

    const json = await res.json();
    return {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      json,
    };
  },
  console: console, // so z.console.log maps to real console.log
};

(async () => {
  try {
    const result = await app.authentication.test(z, {
      authData: { api_token: "2863|Pl3RK4mcB1wSHML9beCjCsG0lAxUNKhMRmilTXt459555a70" },
    });

    console.log("✅ Auth result:", result);

    // Save it to a file
    fs.writeFileSync("authResult.json", JSON.stringify(result, null, 2));
    console.log("📂 Saved auth result to authResult.json");
  } catch (err) {
    console.error("❌ Auth Test Error:", err.message);
  }
})();
