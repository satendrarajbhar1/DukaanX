const isProd = process.env.NODE_ENV === "production";

const base = {
  httpOnly: true,
  secure: isProd,
  // frontend aur backend alag domain pe ho to prod mein "none" chahiye (secure true ke saath)
  sameSite: isProd ? "none" : "strict",
};

export const clearCookieOptions = base;

export const cookieOptions = {
  ...base,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};