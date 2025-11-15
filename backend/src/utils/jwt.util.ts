import { sign, verify, SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    expiresIn: '7d'
  };
  
  return sign(payload, jwtConfig.secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return verify(token, jwtConfig.secret, {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience
  }) as TokenPayload;
};