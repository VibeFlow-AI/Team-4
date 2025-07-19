import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/config';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'student' | 'mentor';
}

export interface TokenPair {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export class JWTService {
  static generateTokenPair(payload: JWTPayload): TokenPair {
    const signOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn as string,
    };

    const refreshSignOptions: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as string,
    };

    const token = jwt.sign(payload, config.jwt.secret, signOptions);
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, refreshSignOptions);

    // Calculate expiresIn as seconds
    const expiresIn = this.parseExpiresIn(config.jwt.expiresIn);

    return {
      token,
      refreshToken,
      expiresIn,
    };
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  }

  static verifyRefreshToken(refreshToken: string): JWTPayload {
    return jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;
  }

  private static parseExpiresIn(expiresIn: string): number {
    // Convert time string to seconds
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // Default 1 hour

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: return 3600;
    }
  }
}
