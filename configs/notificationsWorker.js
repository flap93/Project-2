// 'use strict';

const Reminder = require('../models/Reminder.model');

const notificationWorkerFactory = () => {
  return {
    run: () => {
      Reminder.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();