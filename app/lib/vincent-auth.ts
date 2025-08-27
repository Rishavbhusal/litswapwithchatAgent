import { getWebAuthClient } from "@lit-protocol/vincent-app-sdk/webAuthClient";
import { isExpired } from "@lit-protocol/vincent-app-sdk/jwt";

/**
 * Vincent Authentication Utility
 * Handles user authentication using Vincent Web App Client
 */

export interface VincentUser {
  ethAddress: string;
  publicKey: string;
  tokenId: string;
}

export interface VincentJWT {
  pkpInfo: VincentUser;
  app: {
    id: number;
    version: number;
  };
  authentication: {
    type: "email" | "phone" | "passkey";
    value?: string;
  };
  aud: string[];
  exp: number;
  iat: number;
  iss: string;
  publicKey: string;
  role: string;
}

export interface DecodedVincentJWT {
  decodedJWT: VincentJWT;
  jwtStr: string;
}

/**
 * Get Vincent Web App Client instance
 */
export function getVincentClient() {
  const appId = process.env.NEXT_PUBLIC_VINCENT_APP_ID;

  if (!appId) {
    throw new Error(
      "NEXT_PUBLIC_VINCENT_APP_ID environment variable is required"
    );
  }

  return getWebAuthClient({ appId: parseInt(appId, 10) });
}

/**
 * Check if current URL contains Vincent JWT
 */
export function hasVincentJWTInUrl(): boolean {
  if (typeof window === "undefined") return false;

  const client = getVincentClient();
  return client.uriContainsVincentJWT();
}

/**
 * Decode Vincent JWT from URL
 */
export function decodeVincentJWTFromUrl(): DecodedVincentJWT | null {
  if (typeof window === "undefined") return null;

  try {
    const client = getVincentClient();
    // Use the login page URL as the audience since that's where we redirect
    const audience = `${window.location.origin}/login`;
    console.log("Decoding JWT with audience:", audience);
    const result = client.decodeVincentJWTFromUri(audience);
    return result as unknown as DecodedVincentJWT;
  } catch (error) {
    console.error("Failed to decode Vincent JWT:", error);
    return null;
  }
}

/**
 * Remove Vincent JWT from URL
 */
export function removeVincentJWTFromUrl(): void {
  if (typeof window === "undefined") return;

  const client = getVincentClient();
  client.removeVincentJWTFromURI();
}

/**
 * Redirect to Vincent Connect page
 */
export function redirectToVincentConnect(redirectUri?: string): void {
  if (typeof window === "undefined") return;

  const client = getVincentClient();
  // Use the login page as redirect URI to handle the auth flow properly
  const uri = redirectUri || `${window.location.origin}/login`;

  console.log("Redirecting to Vincent Connect with URI:", uri);
  client.redirectToConnectPage({ redirectUri: uri });
}

/**
 * Get stored JWT from localStorage
 */
export function getStoredVincentJWT(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("VINCENT_AUTH_JWT");
}

/**
 * Store JWT in localStorage
 */
export function storeVincentJWT(jwt: string): void {
  if (typeof window === "undefined") return;

  console.log("Storing JWT to localStorage...");
  console.log("JWT length:", jwt.length);
  localStorage.setItem("VINCENT_AUTH_JWT", jwt);

  // Verify it was stored
  const stored = localStorage.getItem("VINCENT_AUTH_JWT");
  console.log("JWT stored successfully:", stored === jwt);
}

/**
 * Remove JWT from localStorage
 */
export function removeStoredVincentJWT(): void {
  if (typeof window === "undefined") return;

  console.log("Removing Vincent JWT...");
  localStorage.removeItem("VINCENT_AUTH_JWT");
  console.log("Vincent JWT removed");
}

/**
 * Check if JWT is expired
 */
export function isVincentJWTExpired(jwt: string): boolean {
  if (!jwt) return true;

  try {
    // First check if JWT has the correct structure
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      return true;
    }

    // Try to decode the payload to check expiration manually
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) {
      return true;
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking JWT expiration:", error);
    return true;
  }
}

/**
 * Verify Vincent JWT (for backend use)
 * Note: Verify function needs to be implemented based on your backend requirements
 */
export function verifyVincentJWT(
  jwt: string,
  audience: string
): VincentJWT | null {
  // This would typically be implemented on the backend
  // For now, we'll just decode the payload without verification
  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload as VincentJWT;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(): boolean {
  const storedJwt = getStoredVincentJWT();

  if (!storedJwt) return false;

  // Use Vincent SDK's isExpired function for consistency
  return !isExpired(storedJwt as any);
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): VincentUser | null {
  const storedJwt = getStoredVincentJWT();

  if (!storedJwt) {
    return null;
  }

  // Use Vincent SDK's isExpired function for consistency
  if (isExpired(storedJwt as any)) {
    removeStoredVincentJWT();
    return null;
  }

  try {
    // Decode JWT payload (Note: This is just for reading, not verification)
    const parts = storedJwt.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = JSON.parse(atob(parts[1]));

    // Check if payload has the expected structure (updated to use pkpInfo)
    if (!payload.pkpInfo || !payload.pkpInfo.ethAddress) {
      throw new Error("Invalid JWT payload structure - missing pkpInfo");
    }

    return payload.pkpInfo;
  } catch (error) {
    console.error("Error parsing JWT:", error);
    removeStoredVincentJWT();
    return null;
  }
}

/**
 * Extract JWT from URL parameter
 */
export function getJWTFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const jwt = urlParams.get("jwt");
  console.log("getJWTFromUrl - Found JWT:", jwt ? "YES" : "NO");
  if (jwt) {
    console.log("JWT length:", jwt.length);
    console.log("JWT preview:", jwt.substring(0, 50) + "...");
  }
  return jwt;
}

/**
 * Remove JWT parameter from URL
 */
export function removeJWTFromUrl(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete("jwt");
  window.history.replaceState({}, "", url.toString());
}

/**
 * Handle authentication flow
 */
export function handleVincentAuth(): {
  isAuthenticated: boolean;
  user: VincentUser | null;
  needsRedirect: boolean;
} {
  try {
    console.log("🔄 Starting auth flow");
    console.log("Current URL:", window.location.href);

    // Check if JWT is in URL parameter
    const jwtFromUrl = getJWTFromUrl();
    console.log("🔍 Check JWT from URL:", jwtFromUrl ? "Found" : "Not found");

    if (jwtFromUrl) {
      console.log("✅ JWT found in URL, saving to localStorage...");

      // Store the JWT directly
      storeVincentJWT(jwtFromUrl);

      // Clean up URL
      removeJWTFromUrl();
      console.log("🧹 URL cleanup completed");

      // Parse JWT to get actual user data
      try {
        const parts = jwtFromUrl.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("📋 Parsed JWT payload:", payload);

          if (payload.pkpInfo) {
            const user: VincentUser = {
              ethAddress: payload.pkpInfo.ethAddress,
              publicKey: payload.pkpInfo.publicKey,
              tokenId: payload.pkpInfo.tokenId,
            };

            console.log("🚀 JWT saved with user data:", user);
            return {
              isAuthenticated: true,
              user,
              needsRedirect: false,
            };
          }
        }
      } catch (parseError) {
        console.error("Failed to parse JWT:", parseError);
      }

      // Fallback to minimal user object if parsing fails
      console.log("🚀 JWT saved, user authenticated (fallback)");
      return {
        isAuthenticated: true,
        user: { ethAddress: "authenticated", publicKey: "", tokenId: "" },
        needsRedirect: false,
      };
    }

    // Check existing authentication
    const storedJwt = getStoredVincentJWT();

    if (!storedJwt) {
      return {
        isAuthenticated: false,
        user: null,
        needsRedirect: true,
      };
    }

    // Parse stored JWT to get user data
    try {
      const parts = storedJwt.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log("📦 Found stored JWT with user data");

        if (payload.pkpInfo) {
          const user: VincentUser = {
            ethAddress: payload.pkpInfo.ethAddress,
            publicKey: payload.pkpInfo.publicKey,
            tokenId: payload.pkpInfo.tokenId,
          };

          return {
            isAuthenticated: true,
            user,
            needsRedirect: false,
          };
        }
      }
    } catch (parseError) {
      console.error("Failed to parse stored JWT:", parseError);
      // If stored JWT is corrupted, remove it
      removeStoredVincentJWT();
      return {
        isAuthenticated: false,
        user: null,
        needsRedirect: true,
      };
    }

    // Fallback
    console.log("📦 Found stored JWT, user authenticated (fallback)");
    return {
      isAuthenticated: true,
      user: { ethAddress: "authenticated", publicKey: "", tokenId: "" },
      needsRedirect: false,
    };
  } catch (error) {
    console.error("Error in handleVincentAuth:", error);
    // Clean up any corrupted state
    removeStoredVincentJWT();
    return {
      isAuthenticated: false,
      user: null,
      needsRedirect: true,
    };
  }
}
