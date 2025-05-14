// import { cookies } from 'next/headers';

export const clearUserCookie = () => {
  if (typeof window !== "undefined") {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }
};
