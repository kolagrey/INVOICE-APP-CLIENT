import { storage, db } from '../../services/firebase';
import { STORAGE_URL } from '../constants/storageTypes';
import { SETTINGS_COLLECTION } from '../constants/collectionsTypes';
import { Settings } from '../../models/Settings';
import { Avatar } from '../../models/Avatar';
import { SETTINGS_KEY } from '../../config/settingsConfig';

export const updateSettings = async (payload) => {
  try {
    const settings = new Settings(payload).sanitize();
    await db
      .collection(SETTINGS_COLLECTION)
      .doc(settings.id)
      .set(settings.credentials, { merge: true });
    return { success: true };
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};

export const updateAvatar = async (payload) => {
  try {
    const company = new Avatar(payload).sanitize();
    const { id, file, fileName } = company.credentials;
    const uploadTask = await storage
      .ref(`${STORAGE_URL}/${fileName}`)
      .put(file);
    const avatarUrl = await (await uploadTask.task).ref.getDownloadURL();

    await db.collection(SETTINGS_COLLECTION).doc(id).set(
      {
        avatar: avatarUrl
      },
      { merge: true }
    );

    return avatarUrl;
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};

export const getCompanySettings = async () => {
  try {
    const id = SETTINGS_KEY;
    if (!id) throw new Error('id is required');
    const docRef = db.collection(SETTINGS_COLLECTION).doc(id);
    return await (await docRef.get()).data();
  } catch (error) {
    // TODO: Log error to crash analytics
    return { error };
  }
};
