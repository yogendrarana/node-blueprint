import * as jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Secret, SignOptions } from "jsonwebtoken";

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// sign jwt token with options
export const signJwtToken = function (payload: string | object | Buffer, secret: Secret, options?: SignOptions) {
    return jwt.sign(payload, secret, options);
};

// generate access and refresh tokens
export const generateAuthTokens = function (payload: Record<string, unknown>): AuthTokens {
    if (!env?.ACCESS_TOKEN_SECRET || !env?.REFRESH_TOKEN_SECRET) {
        throw new Error("JWT secrets required");
    }

    if (!env?.ACCESS_TOKEN_EXPIRES_IN || !env?.REFRESH_TOKEN_EXPIRES_IN) {
        throw new Error("JWT expiration times required");
    }

    const accessTokenOptions: SignOptions = {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
    };

    const refreshTokenOptions: SignOptions = {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
    };

    const accessToken = signJwtToken(payload, env.ACCESS_TOKEN_SECRET as Secret, accessTokenOptions);
    const refreshToken = signJwtToken(payload, env.REFRESH_TOKEN_SECRET as Secret, refreshTokenOptions);

    return { accessToken, refreshToken };
};
