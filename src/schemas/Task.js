import {ObjectId} from 'bson';

class Task {
  constructor({
    name,
    partition,
    status = Task.STATUS_OPEN,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.name = name;
    this.status = status;
  }

  static STATUS_OPEN = 'Open';
  static STATUS_IN_PROGRESS = 'InProgress';
  static STATUS_COMPLETE = 'Complete';

  static schema = {
    name: 'Task',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      name: 'string',
      status: 'string',
    },
    primaryKey: '_id',
  };
}

export {Task};
