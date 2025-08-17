import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^\+?[0-9\-()\s]{7,}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "رقم الهاتف غير صحيح" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the contact request
    
    // For now, we'll just return success
    // In production, implement proper contact handling
    
    const contactData = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString(),
      status: "new"
    };

    // TODO: Save to database
    // TODO: Send email notification to admin
    // TODO: Send confirmation email to customer

    return NextResponse.json({
      success: true,
      message: "تم إرسال رسالتك بنجاح، سنعاود الاتصال بك قريباً",
      data: contactData
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
