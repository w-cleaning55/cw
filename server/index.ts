import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { dataManager } from "./utils/dataManager";
import {
  handleMissingTranslation,
  handleGetTranslations,
  handleUpdateTranslations
} from "./routes/translations";
import { handleAIChat, handleAITest } from "./routes/ai";
import {
  handleDatabaseTest,
  handleDatabaseCreate,
  handleDatabaseRead,
  handleDatabaseUpdate,
  handleDatabaseDelete,
  handleDatabaseQuery
} from "./routes/database";
import {
  handleEmailNotification,
  handleWhatsAppNotification,
  handleTelegramNotification,
  handleSMSNotification,
  handleScheduleNotification,
  handleCancelScheduledNotification,
  handleNotificationHistory,
  handleTestNotificationChannel
} from "./routes/notifications";
import {
  handleGetDashboard,
  handleGetServices,
  handleGetService,
  handleCreateService,
  handleUpdateService,
  handleDeleteService,
  handleGetUsers,
  handleGetUser,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleGetAnalytics,
  handleSearchServices,
  handleSearchUsers
} from "./routes/admin";
import {
  handleGetDashboardStats,
  handleGetBookings,
  handleGetCustomers,
  handleUpdateBookingStatus,
  handleDeleteBooking,
  handleUpdateCustomer,
  handleDeleteCustomer
} from "./routes/admin-dashboard";
import {
  handleGetCompanySettings,
  handleUpdateCompanySettings,
  handleGetCompanyPublicInfo
} from "./routes/company-settings";
import {
  handleGetSiteContent,
  handleUpdateSiteContent,
  handleGetSectionContent,
  handleUpdateSectionContent
} from "./routes/site-content";
import colorPalettesRoutes from "./routes/color-palettes";
import authRoutes from "./routes/auth";
import contentManagementRoutes from "./routes/content-management";
import messagesRoutes from "./routes/messages";
import debugRoutes from "./routes/debug";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from public directory
  app.use(express.static('public'));

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Debug: return available users (sanitized)
  app.get("/api/debug/users", async (_req, res) => {
    try {
      const usersRaw = (await dataManager.readData<any>("users")) || [];
      const users = Array.isArray(usersRaw) ? usersRaw : [];
      const sanitized = users.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
      }));
      res.json({ count: sanitized.length, users: sanitized });
    } catch (err: any) {
      res.status(500).json({ error: "failed to load users", details: err?.message });
    }
  });

  // Translation API routes
  app.post("/api/translations/missing", handleMissingTranslation);
  app.get("/api/translations/:language", handleGetTranslations);
  app.put("/api/translations/:language", handleUpdateTranslations);

  // AI API routes
  app.post("/api/ai/chat", handleAIChat);
  app.post("/api/ai/test", handleAITest);

  // Database API routes
  app.post("/api/database/test", handleDatabaseTest);
  app.post("/api/database/:type/:collection", handleDatabaseCreate);
  app.get("/api/database/:type/:collection/:id?", handleDatabaseRead);
  app.put("/api/database/:type/:collection/:id", handleDatabaseUpdate);
  app.delete("/api/database/:type/:collection/:id", handleDatabaseDelete);
  app.post("/api/database/:type/:collection/query", handleDatabaseQuery);

  // Notification API routes
  app.post("/api/notifications/email", handleEmailNotification);
  app.post("/api/notifications/whatsapp", handleWhatsAppNotification);
  app.post("/api/notifications/telegram", handleTelegramNotification);
  app.post("/api/notifications/sms", handleSMSNotification);
  app.post("/api/notifications/schedule", handleScheduleNotification);
  app.delete("/api/notifications/schedule/:scheduleId", handleCancelScheduledNotification);
  app.get("/api/notifications/history", handleNotificationHistory);
  app.post("/api/notifications/:channel/test", handleTestNotificationChannel);

  // Admin API routes
  app.get("/api/admin/dashboard", handleGetDashboard);

  // Search routes must come before parameterized routes
  app.get("/api/admin/services/search", handleSearchServices);
  app.get("/api/admin/users/search", handleSearchUsers);

  app.get("/api/admin/services", handleGetServices);
  app.get("/api/admin/services/:id", handleGetService);
  app.post("/api/admin/services", handleCreateService);
  app.put("/api/admin/services/:id", handleUpdateService);
  app.delete("/api/admin/services/:id", handleDeleteService);

  app.get("/api/admin/users", handleGetUsers);
  app.get("/api/admin/users/:id", handleGetUser);
  app.post("/api/admin/users", handleCreateUser);
  app.put("/api/admin/users/:id", handleUpdateUser);
  app.delete("/api/admin/users/:id", handleDeleteUser);

  app.get("/api/admin/analytics", handleGetAnalytics);

  // Real Admin Dashboard API routes
  app.get("/api/admin/dashboard-stats", handleGetDashboardStats);
  app.get("/api/admin/bookings", handleGetBookings);
  app.patch("/api/admin/bookings/:id/status", handleUpdateBookingStatus);
  app.delete("/api/admin/bookings/:id", handleDeleteBooking);
  app.get("/api/admin/customers", handleGetCustomers);
  app.patch("/api/admin/customers/:id", handleUpdateCustomer);
  app.delete("/api/admin/customers/:id", handleDeleteCustomer);

  // Company Settings API routes
  app.get("/api/admin/company-settings", handleGetCompanySettings);
  app.put("/api/admin/company-settings", handleUpdateCompanySettings);
  app.get("/api/company-info", handleGetCompanyPublicInfo);

  // Site Content API routes
  app.get("/api/admin/site-content", handleGetSiteContent);
  app.put("/api/admin/site-content", handleUpdateSiteContent);
  app.get("/api/admin/site-content/:section", handleGetSectionContent);
  app.put("/api/admin/site-content/:section", handleUpdateSectionContent);

  // Color Palettes API routes
  app.use("/api/color-palettes", colorPalettesRoutes);

  // Authentication API routes
  app.use("/api/auth", authRoutes);

  // Content Management API routes
  app.use("/api/content-management", contentManagementRoutes);

  // Messages API routes
  app.use("/api/messages", messagesRoutes);

  // Debug routes (safe to ship; expose limited data only)
  app.use("/api", debugRoutes);

  return app;
}
