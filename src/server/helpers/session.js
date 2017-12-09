import createEncryptor from 'simple-encryptor';
import lodashDifference from 'lodash/difference';
import lodashGet from 'lodash/get';
import Session, {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from 'models/session';
import User from 'models/user';


let encryptor = null;
// NOTE: `process.env.ENCRYPTION_SECRET` is not loaded at startup, so create the encryptor here.
export function createSessionEncryptor() {
  encryptor = createEncryptor( process.env.ENCRYPTION_SECRET );
}


export async function getCurrentSessionAndUser( sessionId ) {
  if ( !sessionId ) {
    return { user: null, session: null };
  }
  const userId = encryptor.decrypt(sessionId);
  const [ user, session ] = await Promise.all([
    User.findOne({ _id: userId }),
    Session.findOne({ _id: sessionId }),
  ]);
  return {
    user,
    session,
  };
}

export async function deleteSession( sessionId ) {
  await Session.remove({ _id: sessionId });
}

export async function createSession( userId ) {
  const encryptedUserId = encryptor.encrypt(userId);
  const session = await Session.create({
    _id: encryptedUserId,
  });
  return session;
}

export async function createSessionWithCookie( userId, res ) {
  const createdSession = await createSession( userId );
  res.cookie(
    SESSION_COOKIE_NAME,
    createdSession._id,
    {
      httpOnly: true, // Prevent client side javascript from reading cookie
      maxAge: 1000 * SESSION_DURATION_SECONDS,
    }
  );
}

export function createAuthMiddleware({
  requiredRoles,
  redirect = false,
}) {
  return async function authenticateOrRedirect( req, res, next ) {
    const { user } = await getCurrentSessionAndUser( req.cookies[SESSION_COOKIE_NAME] );
    if ( requiredRoles ) {
      const userRoles = lodashGet( user, 'roles' );
      const hasRequiredRoles = userRoles && lodashDifference(requiredRoles, userRoles).length === 0;
      if ( hasRequiredRoles ) {
        next();
        return;
      }
    }

    if ( redirect ) {
      const nextPath = user ? '/' : `/login?next=${encodeURIComponent(req.originalUrl)}`;
      res.redirect(nextPath);
      return;
    }
    res.status(401);
    res.json({
      error: 'Unauthorized access',
    });
  };
}
