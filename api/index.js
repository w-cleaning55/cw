import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(express.json());

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");
const palettesFile = path.join(dataDir, "color-palettes.json");

async function readUsers() {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // Return default users if file cannot be read (Vercel read-only filesystem)
    return [
      {
        id: "admin-1",
        username: "admin",
        email: "admin@cleaningworld.sa",
        password:
          "$2b$10$cnmRVkKL012/IbI2.1SbGe5gVhcjfge9/wdE3zJlwb3pazO3wC7hK",
        role: "admin",
        permissions: [
          {
            module: "users",
            actions: ["create", "read", "update", "delete"],
          },
          {
            module: "services",
            actions: ["create", "read", "update", "delete"],
          },
          {
            module: "bookings",
            actions: ["create", "read", "update", "delete"],
          },
          {
            module: "customers",
            actions: ["create", "read", "update", "delete"],
          },
          {
            module: "settings",
            actions: ["create", "read", "update", "delete"],
          },
        ],
        isActive: true,
        createdAt: "2025-08-09T04:11:25.425Z",
        updatedAt: "2025-08-09T04:11:25.425Z",
        lastLogin: "2025-08-09T04:11:25.625Z",
      },
      {
        id: "admin-test-1",
        username: "testadmin",
        email: "testadmin@cleaningworld.sa",
        password:
          "$2b$10$j.yF8IyMwIqMbfcfbrlMQeUczusS/X5djUdW6mCDVIAKiLd33gXau",
        role: "admin",
        permissions: [
          { module: "users", actions: ["create", "read", "update", "delete"] },
          {
            module: "services",
            actions: ["create", "read", "update", "delete"],
          },
          {
            module: "bookings",
            actions: ["create", "read", "update", "delete"],
          },
          {
            module: "customers",
            actions: ["create", "read", "update", "delete"],
          },
          {
            module: "settings",
            actions: ["create", "read", "update", "delete"],
          },
        ],
        isActive: true,
        createdAt: "2025-08-09T06:50:00.000Z",
        updatedAt: "2025-08-09T06:50:00.000Z",
        lastLogin: null,
      },
    ];
  }
}

async function writeUsers(users) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

async function safeWriteUsers(users) {
  try {
    await writeUsers(users);
  } catch (err) {
    console.warn(
      "Users write skipped (read-only fs likely):",
      err?.message || err,
    );
  }
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

async function readPalettes() {
  try {
    const data = await fs.readFile(palettesFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return getDefaultPalettes();
  }
}

async function writePalettes(palettes) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(palettesFile, JSON.stringify(palettes, null, 2));
}

async function safeWritePalettes(palettes) {
  try {
    await writePalettes(palettes);
  } catch (err) {
    console.warn(
      "Palettes write skipped (read-only fs likely):",
      err?.message || err,
    );
  }
}

// Healthcheck/demo
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});
app.get("/demo", (_req, res) => {
  res.json({ message: "Demo endpoint working!" });
});

// Debug endpoint to check available users (remove in production)
app.get("/debug/users", async (_req, res) => {
  const users = await readUsers();
  const sanitizedUsers = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  }));
  res.json({ users: sanitizedUsers, count: users.length });
});

// Auth: Login
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const users = await readUsers();

    const user = users.find((u) => u.username === username);
    if (!user) {
      return res
        .status(401)
        .json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "حساب المستخدم غير نشط" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Try to update last login (will be skipped on read-only filesystem like Vercel)
    user.lastLogin = new Date().toISOString();
    await safeWriteUsers(users);

    res.json({
      user: sanitizeUser(user),
      token,
      message: "تم تسجيل الدخول بنجاح",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Auth: Verify
app.get("/auth/verify", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access token required" });

    jwt.verify(token, JWT_SECRET, async (err, payload) => {
      if (err)
        return res.status(403).json({ error: "Invalid or expired token" });
      const users = await readUsers();
      const user = users.find((u) => u.id === payload.id);
      if (!user || !user.isActive)
        return res.status(401).json({ error: "مستخدم غير صالح" });
      res.json(sanitizeUser(user));
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "خطأ في التحقق" });
  }
});

// Auth: Logout (no-op)
app.post("/auth/logout", (_req, res) => {
  res.json({ message: "تم تسجيل الخروج بنجاح" });
});

// Color Palettes: list
app.get("/color-palettes", async (_req, res) => {
  try {
    const palettes = await readPalettes();
    res.json(palettes);
  } catch (err) {
    console.error("Error fetching color palettes:", err);
    res.status(500).json({ error: "فشل في تحميل الباليتات" });
  }
});

// Color Palettes: active
app.get("/color-palettes/active", async (_req, res) => {
  try {
    const palettes = await readPalettes();
    const active = palettes.find((p) => p.isActive) || palettes[0];
    res.json(active);
  } catch (err) {
    console.error("Error fetching active palette:", err);
    res.status(500).json({ error: "فشل في تحميل الباليت النشط" });
  }
});

function getDefaultPalettes() {
  return [
    {
      id: "clean-light",
      name: "Clean Light",
      nameAr: "نظيف فاتح",
      description: "Clean and professional light theme for cleaning services",
      descriptionAr: "ثيم فاتح نظيف ومهني لخدمات التنظيف",
      category: "business",
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        accent: "#0ea5e9",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#0f172a",
        textSecondary: "#64748b",
        border: "#e2e8f0",
        success: "#16a34a",
        warning: "#ea580c",
        error: "#dc2626",
        info: "#0ea5e9",
      },
      cssVariables: {
        "--radius": "0.5rem",
        "--brand-50": "240 100% 98%",
        "--brand-500": "217 91% 60%",
        "--brand-600": "217 91% 52%",
      },
      isActive: true,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "clean-dark",
      name: "Clean Dark",
      nameAr: "نظيف داكن",
      description: "Modern dark theme with professional cleaning aesthetics",
      descriptionAr: "ثيم داكن عصري بجماليات تنظيف مهنية",
      category: "business",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#06b6d4",
        background: "#0f172a",
        surface: "#1e293b",
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        border: "#334155",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#06b6d4",
      },
      cssVariables: {
        "--radius": "0.5rem",
        "--brand-50": "220 14% 10%",
        "--brand-500": "217 91% 60%",
        "--brand-600": "217 91% 52%",
      },
      isActive: false,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export default app;
