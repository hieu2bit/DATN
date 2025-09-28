import { setUser } from '../store/userSlice';
import store from './store';
import AuthService from '../services/AuthService';

const CheckAuth = async () => {
  return new Promise((resolve, reject) => {
    const token = AuthService.getToken(); 
    const role = AuthService.getRole(); 

    if (token && role) {
      store.dispatch(
        setUser({
          name: 'User', // Nếu có API lấy tên, thay thế giá trị này
          email: 'user@example.com', // Thay bằng dữ liệu thực tế
          role, 
          token, 
        })
      );
      resolve({ token, role });
    } else {
      reject('No token or role');
    }
  });
};

export default CheckAuth;
