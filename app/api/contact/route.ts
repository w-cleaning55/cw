import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/auth";

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100, "الاسم طويل جداً"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  phone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل").max(20, "رقم الهاتف طويل جداً"),
  service: z.string().optional(),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل").max(1000, "الرسالة طويلة جداً"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(`contact:${clientIp}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "تم إرسال رسائل كثيرة. يرجى المحاولة لاحقاً." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "بيانات غير صحيحة",
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { name, email, phone, service, message } = validationResult.data;

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone.trim(),
      service: service?.trim() || "غير محدد",
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ip: clientIp,
    };

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send SMS notification
    // 4. Create ticket in CRM
    
    // For now, we'll just log the contact request
    console.log("Contact form submission:", sanitizedData);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json({
      success: true,
      message: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.",
      data: {
        id: `contact-${Date.now()}`,
        submittedAt: sanitizedData.timestamp,
      },
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
