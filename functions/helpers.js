const { groupBy } = require('lodash/fp');

const getTimeFromDate = function (date) {
  const timeArr = date.split('T')[1].split(':');
  return timeArr[0] + timeArr[1];
};

const dateInTimeRange = function ({ date, start, end }) {
  const dateTime = getTimeFromDate(date);
  const startTime = getTimeFromDate(start);
  const endTime = getTimeFromDate(end);

  return startTime <= dateTime && dateTime < endTime;
};

exports.getTimeFromDate = getTimeFromDate;
exports.dateInTimeRange = dateInTimeRange;

exports.getUsersWithAvailabilityMatch = function ({
  availableChats = [],
  availabilities = [],
}) {
  const userIds = [];
  if (!availableChats.length || !availabilities.length) return userIds;
  const availabilityByUserId = groupBy('userId', availabilities);
  const availabilityByDay = groupBy('dayIndex', availabilities);
  const maxUsers = Object.keys(availabilityByUserId).length;

  availableChats.some(chat => {
    availabilityByDay[chat.day] &&
      availabilityByDay[chat.day].some(({ start, end, userId }) => {
        const overlapping = dateInTimeRange({
          date: chat.start,
          start,
          end,
        });
        if (overlapping) userIds.push(userId);
        return userIds.length === maxUsers;
      }, availabilityByUserId);
    return userIds.length === maxUsers;
  });

  return userIds;
};
