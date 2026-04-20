import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin
  const configPath = path.join(__dirname, 'firebase-applet-config.json');
  let firebaseConfig;
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (e) {
    console.error("Firebase config not found, SEO might not work correctly.");
  }
  
  let adminApp;
  if (firebaseConfig && !admin.apps.length) {
    adminApp = admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  } else {
    adminApp = admin.apps[0];
  }

  const db = (firebaseConfig && adminApp) ? getFirestore(adminApp, firebaseConfig.firestoreDatabaseId || "(default)") : null;

  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  // Intercept ebook sharing links for SEO
  app.get("/ebook/:id", async (req, res, next) => {
    const ebookId = req.params.id;
    try {
      let title = "Spiritux - Sagesses Célestes";
      let description = "Le Sanctuaire du savoir spirituel et des manuscrits sacrés.";
      let image = "https://image2url.com/r2/default/images/1770004935640-08fb3b0f-a3e7-4a0a-8614-9cfb1ed71540.png";

      if (db) {
        const doc = await db.collection("ebooks").doc(ebookId).get();
        if (doc.exists) {
          const ebook = doc.data();
          title = ebook?.title || title;
          description = ebook?.description || description;
          image = ebook?.image || image;
        }
      }
      
      let template = fs.readFileSync(
        process.env.NODE_ENV !== "production" 
          ? path.resolve(__dirname, "index.html")
          : path.resolve(__dirname, "dist/index.html"),
        "utf-8"
      );

      // Inject meta tags
      const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="book" />
    <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`;

      // Replace existing title and add other tags
      template = template.replace(/<title>.*?<\/title>/, metaTags);

      if (process.env.NODE_ENV !== "production" && vite) {
        template = await vite.transformIndexHtml(req.originalUrl, template);
      }
      
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      if (process.env.NODE_ENV !== "production" && vite) {
        vite.ssrFixStacktrace(e as Error);
      }
      next(e);
    }
  });

  // Fallback for SPA
  app.get('*all', async (req, res, next) => {
    if (process.env.NODE_ENV !== "production" && vite) {
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    } else {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
