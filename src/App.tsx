import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const HOST = 'http://localhost:3000';

  const [noAuth, setNoAuth] = useState();
  const [needAuth, setNeedAuth] = useState();

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }

    return config;
  });

  axios.interceptors.response.use(
    (res) => {
      // 从接口返回的header中取出token
      const token = res.headers['token'];

      // 更新本地token
      if (token) {
        localStorage.setItem('token', token);
      }
      return res;
    },
    (err) => {
      console.log(err);
    },
  );

  const login = async () => {
    const { data: token } = await axios.post(`${HOST}/user/login`, {
      username: 'xin',
      password: '123456',
    });

    localStorage.setItem('token', token);

    query();
  };

  const query = async () => {
    try {
      const res1 = await axios.get(`${HOST}/no-auth`);

      const res2 = await axios.get(`${HOST}/need-auth`);

      setNoAuth(res1.data);
      setNeedAuth(res2.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <>
      <div> {noAuth}</div>
      <div> {needAuth}</div>
    </>
  );
}

export default App;
