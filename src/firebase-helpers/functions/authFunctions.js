import { auth } from '../../services/firebase';
import { UserAuth } from '../../models/User';

// User Sign Up
export const signUp = async (payload = {}) => {
  try {
    const userAuth = new UserAuth(payload).sanitize();
    return auth().createUserWithEmailAndPassword(
      userAuth.credentials.email,
      userAuth.credentials.password
    );
  } catch (error) {
    // TODO: Log error to crash analytics
    return error;
  }
};

export const sendVerificationEmail = async () => {
  try {
    return auth().currentUser.sendEmailVerification();
  } catch (error) {
    // TODO: Log error to crash analytics
    return error;
  }
};

// User Sign In
export const signIn = async (payload = {}) => {
  try {
    const userAuth = new UserAuth(payload).sanitize();
    return auth().signInWithEmailAndPassword(
      userAuth.credentials.email,
      userAuth.credentials.password
    );
  } catch (error) {
    // TODO: Log error to crash analytics
    return error;
  }
};

// User Sign Out
export const signOut = async () => {
  try {
    return auth().signOut();
  } catch (error) {
    // TODO: Log error to crash analytics
    return error;
  }
};
