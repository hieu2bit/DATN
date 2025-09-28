import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbuEcJEvMZYasxSqfmaLfERDgE8P1qYHM",
  authDomain: "endlesstechstoreecommerce.firebaseapp.com",
  projectId: "endlesstechstoreecommerce",
  storageBucket: "endlesstechstoreecommerce.appspot.com",
  messagingSenderId: "698894677458",
  appId: "1:698894677458:web:9b1d5e0f00be3658edc40b",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const UploadFileService = {
  uploadProductImage: async (file) => {
    try {
      const uniqueFileName = `Account/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, uniqueFileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      console.log(`Ảnh sản phẩm đã tải lên: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi tải ảnh sản phẩm lên:", error);
      throw error;
    }
  },

  uploadEmployeeImage: async (file) => {
    try {
      const uniqueFileName = `Employees/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, uniqueFileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      console.log(`Ảnh sản phẩm đã tải lên: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi tải ảnh sản phẩm lên:", error);
      throw error;
    }
  },
};

export default UploadFileService;
