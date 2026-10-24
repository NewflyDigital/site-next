const admin = require("firebase-admin");

const hasFullJson =
  !!process.env.FIREBASE_SERVICE_ACCOUNT ||
  !!process.env.FIREBASE_SERVICE_ACCOUNT_B64;
const hasSplit =
  !!process.env.FIREBASE_PRIVATE_KEY &&
  !!process.env.FIREBASE_CLIENT_EMAIL &&
  !!process.env.FIREBASE_PROJECT_ID;

console.log(
  "DEBUG firebaseAdmin - hasFullJson:",
  !!process.env.FIREBASE_SERVICE_ACCOUNT,
  "hasFullB64:",
  !!process.env.FIREBASE_SERVICE_ACCOUNT_B64,
  "hasSplit:",
  hasSplit,
);

if (!hasFullJson && !hasSplit) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT env var not set and FIREBASE_PRIVATE_KEY/CLIENT_EMAIL/PROJECT_ID not set",
  );
}

let serviceAccount;

if (hasSplit) {
  // monta o objeto a partir das 3 vars menores
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  // se foi armazenado com \n, converte para newline real
  const normalizedKey = rawKey.includes("\\n")
    ? rawKey.replace(/\\n/g, "\n")
    : rawKey;
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || undefined,
    private_key: normalizedKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID || undefined,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      process.env.FIREBASE_CLIENT_X509_CERT_URL || undefined,
  };
} else {
  // antiga lógica: JSON cru ou base64 do JSON
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT || null;
  const rawB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64 || null;

  try {
    if (rawJson) {
      serviceAccount = JSON.parse(rawJson);
    } else {
      const decoded = Buffer.from(rawB64, "base64").toString("utf8");
      serviceAccount = JSON.parse(decoded);
    }
  } catch (err) {
    console.error(
      "Failed to parse Firebase service account:",
      err && err.message,
    );
    throw new Error(
      "Invalid FIREBASE_SERVICE_ACCOUNT content (not valid JSON/base64)",
    );
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
