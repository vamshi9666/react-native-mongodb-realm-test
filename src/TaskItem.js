import React, {useState} from 'react';
import {Text, ListItem, Overlay} from 'react-native-elements';
import {Task} from './schemas';
import {useTasks} from './contexts';

// Action sheet contains a list of actions. Each action should have a `title`
// string and `action` function property. A "Cancel" action is automatically
// added to the end of your list of actions. You must also provide the
// closeOverlay function that this component will call to request that the
// action sheet be closed.
function ActionSheet({actions, visible, closeOverlay}) {
  const cancelAction = {
    title: 'Cancel',
    action: closeOverlay,
  };
  return (
    <Overlay
      overlayStyle={{width: '90%'}}
      isVisible={visible}
      onBackdropPress={closeOverlay}>
      <>
        {[...actions, cancelAction].map(({title, action}) => (
          <ListItem
            key={title}
            title={title}
            onPress={() => {
              closeOverlay();
              action();
            }}
          />
        ))}
      </>
    </Overlay>
  );
}

// The TaskItem represents a Task in a list. When you click an item in the list,
// an action sheet appears. The action sheet contains a list of actions the user
// can perform on the task, namely deleting and changing its status.
export function TaskItem({task}) {
  // Pull the task actions from the TasksProvider.

  const {deleteTask, setTaskStatus} = useTasks();

  // The action sheet appears when the user presses an item in the list.
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  // Specify the list of available actions in the action list when the user
  // presses an item in the list.
  const actions = [
    {
      title: 'Delete',
      action: () => {
        deleteTask(task);
      },
    },
  ];

  // For each possible status other than the current status, make an action to
  // move the task into that status. Rather than creating a generic method to
  // avoid repetition, we split each status to separate each case in the code
  // below for demonstration purposes.
  if (task.status !== Task.STATUS_OPEN) {
    actions.push({
      title: 'Mark Open',

      action: () => {
        setTaskStatus(task, Task.STATUS_OPEN);
      },
    });
  }
  if (task.status !== Task.STATUS_IN_PROGRESS) {
    actions.push({
      title: 'Mark In Progress',

      action: () => {
        setTaskStatus(task, Task.STATUS_IN_PROGRESS);
      },
    });
  }
  if (task.status !== Task.STATUS_COMPLETE) {
    actions.push({
      title: 'Mark Complete',

      action: () => {
        setTaskStatus(task, Task.STATUS_COMPLETE);
      },
    });
  }

  return (
    <>
      <ActionSheet
        visible={actionSheetVisible}
        closeOverlay={() => setActionSheetVisible(false)}
        actions={actions}
      />
      <ListItem
        key={task.id}
        onPress={() => {
          setActionSheetVisible(true);
        }}
        title={task.name}
        bottomDivider
        checkmark={
          task.status === Task.STATUS_COMPLETE ? (
            <Text>&#10004; {/* checkmark */}</Text>
          ) : task.status === Task.STATUS_IN_PROGRESS ? (
            <Text>In Progress</Text>
          ) : null
        }
      />
    </>
  );
}
