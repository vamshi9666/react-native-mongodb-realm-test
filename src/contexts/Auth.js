import React, {useContext, useState, createContext} from 'react';
import Realm from 'realm';
import {getRealmApp} from '../getRealmApp';
const app = getRealmApp();

const AuthContext = createContext(null);
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const logIn = async (email, password) => {
    console.log(`Logging in as ${email}...`);
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds);
    setUser(newUser);
    console.log(`Logged in as ${newUser.identity}`);
  };

  // Log out the current user.
  const logOut = () => {
    if (user == null) {
      console.warn("Not logged in -- can't log out!");
      return;
    }
    console.log('Logging out...');
    user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error('useAuth() called outside of a AuthProvider?');
  }
  return auth;
};
