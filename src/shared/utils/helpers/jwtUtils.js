export const jwtUtils = {
  // Decode JWT without verification
  decode: (token) => {
    try {
      if (!token || typeof token !== 'string') return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      return {
        header,
        payload,
        signature: parts[2],
        raw: token
      };
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  },

  // Check if token is expired
  isExpired: (token) => {
    try {
      const decoded = jwtUtils.decode(token);
      if (!decoded?.payload?.exp) return true;
      
      const now = Math.floor(Date.now() / 1000);
      return decoded.payload.exp < now;
    } catch (error) {
      return true;
    }
  },

  // Get comprehensive token info
  getTokenInfo: (token) => {
    try {
      const decoded = jwtUtils.decode(token);
      if (!decoded) return null;
      
      const now = Math.floor(Date.now() / 1000);
      const exp = decoded.payload.exp;
      const iat = decoded.payload.iat;
      
      return {
        valid: !!decoded,
        expired: exp ? exp < now : false,
        expiresAt: exp ? new Date(exp * 1000).toISOString() : null,
        issuedAt: iat ? new Date(iat * 1000).toISOString() : null,
        timeToExpiry: exp ? exp - now : null,
        subject: decoded.payload.sub,
        payload: decoded.payload,
        header: decoded.header
      };
    } catch (error) {
      return null;
    }
  }
};

export default jwtUtils;