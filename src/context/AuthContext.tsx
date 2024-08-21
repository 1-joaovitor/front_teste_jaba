
import { createContext, useEffect, useState, ReactNode } from 'react'


import { useRouter } from 'next/router'

import authConfig from 'src/configs/auth'

import { AuthValuesType, LoginParams, UserDataType } from './types'
import { getProfile, login } from 'src/services/auth'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}
export const isAuthenticated = () => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName);

  if (token == null) {
    window.localStorage.removeItem("userData");
    
return null;
  }

  return token;
};
const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
      if (storedToken) {
        setLoading(true);
        try {
          const response = await getProfile(storedToken);

          const userdata = {
            id: response.id,
            name: response.name,
            email: response.email,
            phone: response.phone,
            document: response.document,
            role: 'admin'
          }
          setUser(userdata);
        } catch (error) {
          console.error('Erro ao verificar usuário:', error);
          localStorage.removeItem('userData');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessToken');
          setUser(null);
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (params: LoginParams) => {
    try {

      const response = await login(params);
      const userdata = {
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        document: response.document,
        role: 'admin'
      }
      if (params?.rememberMe) {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.acessToken);
        window.localStorage.setItem('userData', JSON.stringify(userdata));
      }
      setUser(userdata);
      const redirectURL = router.query.returnUrl ? router.query.returnUrl : '/';
      router.replace(redirectURL as string);
    } catch (error) {
      console.log(error)
    }
  };

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
