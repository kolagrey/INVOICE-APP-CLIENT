import { fbf, auth, storage, db } from '../../services/firebase';
import { UPDATE_ADMIN_PROFILE } from '../constants/functionsTypes';
import { STORAGE_URL } from '../constants/storageTypes';
import { USER_PROFILES_COLLECTION } from '../constants/collectionsTypes';
import { UserProfile } from '../../models/User';
import { Avatar } from '../../models/Avatar';

export const updateAdminProfile = async (payload) => {
  try {
    const user = new UserProfile(payload).sanitize();
    const updateAdminProfile = fbf.httpsCallable(UPDATE_ADMIN_PROFILE);
    const response = await updateAdminProfile(user.credentials);
    return response;
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};

export const updateUserProfile = async (payload) => {
  try {
    const user = new UserProfile(payload).sanitize();
    await db
      .collection(USER_PROFILES_COLLECTION)
      .doc(user.id)
      .set(user.credentials, { merge: true });
    return { success: true };
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};

export const updateUserProfileAvatar = async (payload) => {
  try {
    const user = new Avatar(payload).sanitize();
    const currentUser = auth().currentUser;
    const { id, file, fileName } = user.credentials;
    const uploadTask = await storage
      .ref(`${STORAGE_URL}/${fileName}`)
      .put(file);
    const avatarUrl = await (await uploadTask.task).ref.getDownloadURL();

    await db.collection(USER_PROFILES_COLLECTION).doc(id).set(
      {
        avatar: avatarUrl
      },
      { merge: true }
    );

    await currentUser.updateProfile({
      photoURL: avatarUrl
    });

    return avatarUrl;
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};

export const getProfile = async (id) => {
  try {
    if (!id) throw new Error('id is required');
    const docRef = db.collection(USER_PROFILES_COLLECTION).doc(id);
    return await (await docRef.get()).data();
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};
