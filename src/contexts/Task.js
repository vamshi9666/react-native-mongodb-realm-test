import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {useAuth} from './Auth';
import {Task} from '../schemas';
const TasksContext = React.createContext(null);

export const TasksProvider = ({children, projectId}) => {
  const {user} = useAuth();

  useEffect(() => {
    if (user == null) {
      console.warn('TasksView must be authenticated!');
      return;
    }

    const config = {
      schema: [Task.schema],
      sync: {
        user,
        partitionValue: projectId,
      },
    };

    console.log(
      `Attempting to open Realm ${projectId} for user ${
        user.identity
      } with config: ${JSON.stringify(config)}...`,
    );

    let canceled = false;

    Realm.open(config)
      .then((openedRealm) => {
        if (canceled) {
          openedRealm.close();
          return;
        }

        realmRef.current = openedRealm;

        const syncTasks = openedRealm.objects('Task');

        openedRealm.addListener('change', () => {
          setTasks([...syncTasks]);
        });

        setTasks([...syncTasks]);
      })
      .catch((error) => alert('Failed to open realm:' + JSON.stringify(error)));

    return () => {
      canceled = true;

      const realm = realmRef.current;
      if (realm != null) {
        realm.removeAllListeners();
        realm.close();
        realmRef.current = null;
      }
    };
  }, [user, projectId]); // Declare dependencies list in the second parameter to useEffect().
  // The tasks list will contain the tasks in the realm when opened.
  const [tasks, setTasks] = useState([]);

  // This realm does not need to be a state variable, because we don't re-render
  // on changing the realm.
  const realmRef = useRef(null);
  // Define our create, update, and delete functions that users of the
  // useTasks() hook can call.
  const createTask = (newTaskName) => {
    const realm = realmRef.current;

    // Open a write transaction.

    realm.write(() => {
      // Create a new task in the same partition -- that is, in the same project.

      realm.create(
        'Task',

        new Task({name: newTaskName || 'New Task', partition: projectId}),
      );
    });
  };

  // Define the function for updating a task's status.
  const setTaskStatus = (task, status) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.
    if (
      ![
        Task.STATUS_OPEN,
        Task.STATUS_IN_PROGRESS,
        Task.STATUS_COMPLETE,
      ].includes(status)
    ) {
      throw new Error(`Invalid Status ${status}`);
    }
    const realm = realmRef.current;

    realm.write(() => {
      task.status = status;
    });
  };

  // Define the function for deleting a task.
  const deleteTask = (task) => {
    const realm = realmRef.current;

    realm.write(() => {
      realm.delete(task);
    });
  };
  return (
    <TasksContext.Provider
      value={{
        createTask,
        deleteTask,
        setTaskStatus,
        tasks,
        projectId,
      }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const value = useContext(TasksContext);
  if (value == null) {
    throw new Error('useTasks() called outside of a TasksProvider?');
  }
  return value;
};
// Create the context that will be provided to descendants of TasksProvider via
// the useTasks hook.
