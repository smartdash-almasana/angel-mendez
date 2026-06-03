import express from 'express';
import {
  getSettings,
  updateSettings,
  getSubscribers,
  toggleSubscriberStatus,
  addSubscriber,
  deleteSubscriber,
  isPrismaActive
} from '../../server/db.js';

const app = express();
app.use(express.json());

// ── Basic Auth Middleware ──────────────────────────────────────────────────
const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Panel Administrativo Dr. Mendez"');
    return res.status(401).send('Se requiere autenticación para acceder al panel administrativo.');
  }

  try {
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') {
      res.setHeader('WWW-Authenticate', 'Basic realm="Panel Administrativo Dr. Mendez"');
      return res.status(401).send('Formato de autenticación inválido.');
    }

    const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPass = process.env.ADMIN_PASS || 'MendezPenalPractica2026!';

    if (username === expectedUser && password === expectedPass) {
      return next();
    } else {
      res.setHeader('WWW-Authenticate', 'Basic realm="Panel Administrativo Dr. Mendez"');
      return res.status(401).send('Usuario o contraseña incorrectos.');
    }
  } catch {
    return res.status(400).send('Error durante el proceso de autenticación.');
  }
};

// ── Public API ────────────────────────────────────────────────────────────
app.get('/api/settings', async (_req, res) => {
  try {
    const settings = await getSettings();
    res.json({ ...settings, isPrismaActive: isPrismaActive() });
  } catch (err) {
    console.error('API error getting settings:', err);
    res.status(500).json({ error: 'Error del servidor al obtener la configuración' });
  }
});

// ── Admin verification ────────────────────────────────────────────────────
app.get('/api/admin/verify', requireAdminAuth, (_req, res) => {
  res.json({ verified: true, isPrismaActive: isPrismaActive() });
});

// ── Settings (admin) ─────────────────────────────────────────────────────
app.post('/api/admin/settings', requireAdminAuth, async (req, res) => {
  try {
    const { aliasMercadoPago } = req.body;
    if (!aliasMercadoPago || typeof aliasMercadoPago !== 'string') {
      return res.status(400).json({ error: 'El alias no es válido o está vacío.' });
    }
    const updated = await updateSettings(aliasMercadoPago);
    res.json(updated);
  } catch (err) {
    console.error('API error updating settings:', err);
    res.status(500).json({ error: 'No se pudo actualizar la configuración' });
  }
});

// ── Subscribers (admin) ───────────────────────────────────────────────────
app.get('/api/admin/subscribers', requireAdminAuth, async (_req, res) => {
  try {
    const subscribers = await getSubscribers();
    res.json(subscribers);
  } catch (err) {
    console.error('API error listing subscribers:', err);
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
    console.error('API error creating subscriber:', err);
    res.status(500).json({ error: 'No se pudo crear el suscriptor' });
  }
});

app.post('/api/admin/subscribers/:id/toggle', requireAdminAuth, async (req, res) => {
  try {
    const updated = await toggleSubscriberStatus(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('API error toggling subscriber:', err);
    res.status(500).json({ error: 'No se pudo alternar el estado del suscriptor' });
  }
});

app.delete('/api/admin/subscribers/:id', requireAdminAuth, async (req, res) => {
  try {
    await deleteSubscriber(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('API error deleting subscriber:', err);
    res.status(500).json({ error: 'No se pudo eliminar el suscriptor' });
  }
});

export default app;
