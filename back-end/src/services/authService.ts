import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import config from '../config/config';

export interface RegisterRequest {
  role: 'student' | 'mentor';
  email: string;
  password: string;
  name: string;
  age: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    age: number;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export class AuthService {
  
  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { role, email, password, name, age } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('USER_ALREADY_EXISTS');
    }

    // Validate age based on role
    if (role === 'mentor' && age < 18) {
      throw new Error('MENTOR_MINIMUM_AGE');
    }

    if (age < 5 || age > 100) {
      throw new Error('INVALID_AGE');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      name: name.trim(),
      age,
    });

    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        age: user.age,
      },
    };
  }

  /**
   * Login user
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        age: user.age,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshData: RefreshTokenRequest): Promise<AuthResponse> {
    const { refreshToken } = refreshData;

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('INVALID_REFRESH_TOKEN');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      return {
        ...tokens,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          age: user.age,
        },
      };

    } catch (error) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshData: RefreshTokenRequest): Promise<{ message: string }> {
    // In a production app, you'd want to blacklist the refresh token
    // For now, we'll just return success
    // TODO: Implement refresh token blacklisting
    
    return { message: 'Logged out successfully' };
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(user: IUser): { token: string; refreshToken: string; expiresIn: number } {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    // Convert expiresIn to seconds
    const expiresIn = this.parseExpirationTime(config.jwt.expiresIn);

    return {
      token,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Parse expiration time string to seconds
   */
  private parseExpirationTime(expiresIn: string): number {
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

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
