import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  getSettings,
  updateSettings,
  getSubscribers,
  toggleSubscriberStatus,
  addSubscriber,
  deleteSubscriber,
  isPrismaActive,
  getDbDiagnostics
} from './server/db.js';

// Setup file/dir names since we are in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Express Basic Auth Middleware
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Se requiere autenticación para acceder al panel administrativo.' });
    }

    try {
      const authHeaderParts = authHeader.split(' ');
      if (authHeaderParts.length !== 2 || authHeaderParts[0].toLowerCase() !== 'basic') {
        return res.status(401).json({ error: 'Formato de autenticación inválido.' });
      }

      const decoded = Buffer.from(authHeaderParts[1], 'base64').toString('utf-8');
      const [username, password] = decoded.split(':');

      const expectedUser = 'admin';
      const expectedPass = 'MendezPenalPractica2026!';

      if (username === expectedUser && password === expectedPass) {
        return next();
      } else {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
      }
    } catch (e) {
      return res.status(400).send('Error durante el proceso de autenticación.');
    }
  };

  // --- API ROUTES ---

  // Public settings route for Landing Page
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await getSettings();
      const diag = getDbDiagnostics();
      res.json({
        ...settings,
        isPrismaActive: isPrismaActive(),
        ...diag
      });
    } catch (err) {
      console.error("API error getting settings:", err);
      res.status(500).json({ error: 'Error del servidor al obtener la configuración' });
    }
  });

  // Admin Verification route (allows frontend to prompt authenticating or verification and save credentials)
  app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
    const diag = getDbDiagnostics();
    res.json({ verified: true, isPrismaActive: isPrismaActive(), ...diag });
  });

  // Secure API route to update Settings
  app.post('/api/admin/settings', requireAdminAuth, async (req, res) => {
    try {
      const { aliasMercadoPago } = req.body;
      if (!aliasMercadoPago || typeof aliasMercadoPago !== 'string') {
        return res.status(400).json({ error: 'El alias no es válido o está vacío.' });
      }
      const updated = await updateSettings(aliasMercadoPago);
      res.json(updated);
    } catch (err) {
      console.error("API error updating settings:", err);
      res.status(500).json({ error: 'No se pudo actualizar la configuración' });
    }
  });

  // Secure Subscribers endpoints
  app.get('/api/admin/subscribers', requireAdminAuth, async (req, res) => {
    try {
      const subscribers = await getSubscribers();
      res.json(subscribers);
    } catch (err) {
      console.error("API error listing subscribers:", err);
      res.status(500).json({ error: 'No se pudo listar los suscriptores' });
    }
  });

  app.post('/api/admin/subscribers', requireAdminAuth, async (req, res) => {
    try {
      const { name, email, whatsapp, months } = req.body;
      if (!name || !email || !whatsapp || !months || typeof months !== 'number') {
        return res.status(400).json({ error: 'Campos incompletos o inválidos.' });
      }
      const created = await addSubscriber({ name, email, whatsapp, months });
      res.json(created);
    } catch (err) {
      console.error("API error creating subscriber:", err);
      res.status(500).json({ error: 'No se pudo crear el suscriptor' });
    }
  });

  app.post('/api/admin/subscribers/:id/toggle', requireAdminAuth, async (req, res) => {
    try {
      const updated = await toggleSubscriberStatus(req.params.id);
      res.json(updated);
    } catch (err) {
      console.error("API error toggling subscriber:", err);
      res.status(500).json({ error: 'No se pudo alternar el estado del suscriptor' });
    }
  });

  app.delete('/api/admin/subscribers/:id', requireAdminAuth, async (req, res) => {
    try {
      await deleteSubscriber(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("API error deleting subscriber:", err);
      res.status(500).json({ error: 'No se pudo eliminar el suscriptor' });
    }
  });

  // Route to trigger standard browser basic authentication dialog
  app.get('/admin', requireAdminAuth, (req, res, next) => {
    // Basic Auth succeeded, forward to SPA loading
    next();
  });

  // --- VITE DEV / PRODUCTION INTEGRATION ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n========================================`);
    console.log(`🚀 SERVIDOR ACTIVO EN PUERTO: ${PORT}`);
    console.log(`💼 MENTORÍA PENAL PRÁCTICA - DR. MÉNDEZ`);
    console.log(`========================================\n`);
  });
}

startServer();
