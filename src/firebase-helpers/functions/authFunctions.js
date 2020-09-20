import { auth, fbf } from '../../services/firebase';
import { UserAccount, UserAuth } from '../../models/User';
import { CREATE_USER } from '../constants/functionsTypes';

// Create New User
export const createUser = async (payload) => {
  try {
    const user = new UserAccount(payload).sanitize();
    const updateAdminProfile = fbf.httpsCallable(CREATE_USER);
    const response = await updateAdminProfile(user.credentials);
    return response.data;
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};

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
