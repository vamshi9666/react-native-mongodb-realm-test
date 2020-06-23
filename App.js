/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {LogInView} from './src/LogInView';
import {TasksProvider, useAuth, AuthProvider} from './src/contexts';
import {TasksView} from './src/TasksView';

const App = () => {
  return (
    <AuthProvider>
      <AppBody />
    </AuthProvider>
  );
};

function AppBody() {
  const {user, logOut} = useAuth();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          {user == null ? (
            <LogInView />
          ) : (
            <TasksProvider projectId="My Project">
              <TasksView />
            </TasksProvider>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

export default App;
