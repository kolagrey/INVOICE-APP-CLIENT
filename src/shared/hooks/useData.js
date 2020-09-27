import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { db } from '../../services/firebase';

const useData = (COLLECTION, useState) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.collection(COLLECTION).onSnapshot(
      (querySnapshot) => {
        const dataList = querySnapshot.docs.map((doc) => doc.data());
        setData(dataList);
        setLoading(false);
      },
      (error) => {
        // TODO: Fix with proper error logging
        setLoading(false);
        Sentry.captureException(error);
      }
    );

    return () => unsubscribe();
  }, [COLLECTION]);

  return [data, loading];
};

export default useData;
