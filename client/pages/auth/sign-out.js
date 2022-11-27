import { useEffect } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const SignOut = () => {
  const { handleRequest } = useRequest({
    url: '/api/users/sign-out',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    handleRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
