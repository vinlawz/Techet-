const baseUrl = () =>
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

// Accepts 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX; returns 2547XXXXXXXX or null.
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s()-]/g, "").replace(/^\+/, "");
  const match = /^(?:254|0)([71]\d{8})$/.exec(digits);
  return match ? `254${match[1]}` : null;
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${required("MPESA_CONSUMER_KEY")}:${required("MPESA_CONSUMER_SECRET")}`,
  ).toString("base64");

  const res = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`M-Pesa auth failed (${res.status})`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function timestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
}

export type StkPushResult = {
  merchantRequestId: string;
  checkoutRequestId: string;
};

// Dev-only: skips Safaricom and posts a fake callback to our own endpoint after a short delay.
// A phone ending in 0 simulates a cancelled prompt; anything else succeeds.
function mockStkPush(params: { phone: string; amount: number }): StkPushResult {
  if (process.env.NODE_ENV === "production") {
    throw new Error("MPESA_ENV=mock is not allowed in production");
  }
  const checkoutRequestId = `ws_CO_mock_${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const cancelled = params.phone.endsWith("0");
  const url = new URL("/api/mpesa/callback", process.env.APP_URL ?? "http://localhost:3000");
  url.searchParams.set("token", required("MPESA_CALLBACK_SECRET"));

  setTimeout(() => {
    const stkCallback = cancelled
      ? { CheckoutRequestID: checkoutRequestId, ResultCode: 1032, ResultDesc: "Request cancelled by user" }
      : {
          CheckoutRequestID: checkoutRequestId,
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: params.amount },
              { Name: "MpesaReceiptNumber", Value: `MOCK${Date.now().toString(36).toUpperCase()}` },
            ],
          },
        };
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Body: { stkCallback } }),
    }).catch(() => {});
  }, 5000);

  return { merchantRequestId: "mock", checkoutRequestId };
}

export async function stkPush(params: {
  phone: string;
  amount: number;
  reference: string;
  description: string;
}): Promise<StkPushResult> {
  if (process.env.MPESA_ENV === "mock") return mockStkPush(params);

  const shortcode = required("MPESA_SHORTCODE");
  const ts = timestamp();
  const password = Buffer.from(`${shortcode}${required("MPESA_PASSKEY")}${ts}`).toString("base64");

  const callbackUrl = new URL(required("MPESA_CALLBACK_URL"));
  callbackUrl.searchParams.set("token", required("MPESA_CALLBACK_SECRET"));

  const res = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: process.env.MPESA_TRANSACTION_TYPE ?? "CustomerPayBillOnline",
      Amount: Math.ceil(params.amount),
      PartyA: params.phone,
      PartyB: process.env.MPESA_PARTY_B ?? shortcode,
      PhoneNumber: params.phone,
      CallBackURL: callbackUrl.toString(),
      AccountReference: params.reference.slice(0, 12),
      TransactionDesc: params.description.slice(0, 13),
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    ResponseCode?: string;
    ResponseDescription?: string;
    errorMessage?: string;
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
  };

  if (!res.ok || data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    throw new Error(data.errorMessage ?? data.ResponseDescription ?? "STK push failed");
  }

  return {
    merchantRequestId: data.MerchantRequestID ?? "",
    checkoutRequestId: data.CheckoutRequestID,
  };
}
