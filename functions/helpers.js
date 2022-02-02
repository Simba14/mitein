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
  availableSessions = [],
  availabilities = [],
}) {
  const userIds = [];
  if (!availableSessions.length || !availabilities.length) return userIds;
  const availabilityByUserId = groupBy('userId', availabilities);
  const availabilityByDay = groupBy('dayIndex', availabilities);
  const maxUsers = Object.keys(availabilityByUserId).length;

  availableSessions.some(session => {
    availabilityByDay[session.day] &&
      availabilityByDay[session.day].some(({ start, end, userId }) => {
        const overlapping = dateInTimeRange({
          date: session.start,
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
