import createEncryptor from 'simple-encryptor';
import Session, {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from 'models/session';
import User from 'models/user';


let encryptor = null;
export function createSessionEncryptor() {
  encryptor = createEncryptor( process.env.ENCRYPTION_SECRET );
}

export async function getCurrentSessionAndUser( sessionId ) {
  const userId = encryptor.decrypt(sessionId);
  const [ user, session ] = await Promise.all([
    User.find({ _id: userId }),
    Session.find({ _id: sessionId }),
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
      httpOnly: true,
      maxAge: 1000 * SESSION_DURATION_SECONDS,
    }
  );
}

