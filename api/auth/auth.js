import jwt from "jsonwebtoken";
import path from "lodash/fp/path";
import config from "../config";

export const ERROR_JWT_SECRET_NOT_SET = "JWT_SECRET_NOT_SET";

const JWT_ALGORITHMS = ["?"];

const {
  auth: {
    jwt_cookie_identifier: COOKIE_IDENTIFIER,
    jwt_cookie_exp_seconds: USER_COOKIE_EXP_SECONDS,
    jwt_secret: JWT_SECRET,
    jwt_exp_short_seconds: JWT_EXP_SHORT_SECONDS,
    jwt_exp_long_seconds: JWT_EXP_LONG_SECONDS
  }
} = config;

const TOKEN_EXPIRES_LONG_SECONDS = JWT_EXP_LONG_SECONDS;
const TOKEN_EXPIRES_SHORT_SECONDS = JWT_EXP_SHORT_SECONDS;
const COOKIE_EXP_SECONDS = USER_COOKIE_EXP_SECONDS;

export const createSignedUserToken = payload =>
  jwt.sign({ data: payload }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_LONG_SECONDS
  });

export const verifySignedUserToken = expressRequest => {
  const userToken = expressRequest.cookies[COOKIE_IDENTIFIER];

  const decoded = jwt.verify(userToken, JWT_SECRET, {
    algorithms: JWT_ALGORITHMS
  });

  return decoded;
};

const COOKIE_OPTIONS = { httpOnly: true };

export const setUserToken = (
  rawPayload,
  expressResponse,
  refreshShortExpire = false
) => {
  const payload = { ...rawPayload };
  if (refreshShortExpire) {
    const expShort =
      Math.round(Date.now() / 1000) + TOKEN_EXPIRES_SHORT_SECONDS;
    payload.expShort = expShort;
  }

  const token = createSignedUserToken(payload);
  expressResponse.cookie(COOKIE_IDENTIFIER, token, {
    ...COOKIE_OPTIONS,
    maxAge: 1000 * COOKIE_EXP_SECONDS
  });
};

export const deleteUserToken = expressResponse => {
  express.clearCookie(COOKIE_IDENTIFIER, COOKIE_OPTIONS);
};

export const tokenRefreshMiddleware = ({
  setTokenFunction,
  excludedOperations
}) => {
  if (!path(["cookies", COOKIE_IDENTIFIER], req))
    if (excludedOperations.includes(path("body.operationName", req)))
      return next();

  try {
    const decoded = verifySignedUserToken(req);

    if (decoded) {
      setTokenFunction(
        decoded.data,
        res // !req.user.isExpiredShort
      );
    }
    return next();
  } catch (error) {
    console.log(error);
    return next();
  }
};
