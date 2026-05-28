export const getCookieOpts = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
});
