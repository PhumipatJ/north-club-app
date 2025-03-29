// supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// สำหรับใช้ resend email API
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const sendEmail = async (payload: EmailPayload) => {
  const { to, subject, html, from = "no-reply@yourdomain.com" } = payload;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();
  return { status: res.status, data };
};

serve(async (req) => {
  // ตรวจสอบว่าเป็น OPTIONS request สำหรับ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // รับข้อมูลจาก request
    const payload: EmailPayload = await req.json();
    
    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!payload.to || !payload.subject || !payload.html) {
      return new Response(
        JSON.stringify({ error: "ข้อมูลไม่ครบถ้วน (to, subject, html จำเป็นต้องมี)" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // ส่งอีเมล
    const result = await sendEmail(payload);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: unknown) {
    // แก้ไขการจัดการกับ error ที่เป็น unknown type
    let errorMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});