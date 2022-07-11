const {
  dateInTimeRange,
  getTimeFromDate,
  getUsersWithAvailabilityMatch,
} = require('./helpers');

describe('getTimeFromDate', () => {
  const testData = [
    { input: '2021-11-03T10:00:00.000Z', output: '1000' },
    { input: '2021-11-03T10:30:00.000Z', output: '1030' },
    { input: '2021-11-03T11:00:00.000Z', output: '1100' },
    { input: '2021-11-03T11:30:00.000Z', output: '1130' },
    { input: '2021-11-03T12:00:00.000Z', output: '1200' },
    { input: '2021-11-03T12:30:00.000Z', output: '1230' },
    { input: '2021-11-03T13:00:00.000Z', output: '1300' },
    { input: '2021-11-03T13:30:00.000Z', output: '1330' },
  ];

  test.each(testData)(
    'returns correct time value for given date',
    ({ input, output }) => {
      expect(getTimeFromDate(input)).toBe(output);
    },
  );
});

describe('dateInTimeRange', () => {
  const dataInRange = [
    {
      date: '2021-11-03T10:00:00.000Z',
      start: '2021-11-03T10:00:00.000Z',
      end: '2021-11-03T11:00:00.000Z',
    },
    {
      date: '2021-11-03T10:30:00.000Z',
      start: '2021-11-03T08:30:00.000Z',
      end: '2021-11-03T11:00:00.000Z',
    },
    {
      date: '2021-11-04T11:00:00.000Z',
      start: '2021-11-05T11:00:00.000Z',
      end: '2021-11-05T11:30:00.000Z',
    },
    {
      date: '2001-10-03T18:30:00.000Z',
      start: '2021-11-04T11:30:00.000Z',
      end: '2021-11-04T19:00:00.000Z',
    },
  ];

  test.each(dataInRange)(
    'returns true for given date within time range',
    data => {
      expect(dateInTimeRange(data)).toBeTruthy();
    },
  );

  const dataOutOfRange = [
    {
      date: '2021-11-03T10:00:00.000Z',
      start: '2021-11-03T10:30:00.000Z',
      end: '2021-11-03T11:00:00.000Z',
    },
    {
      date: '2021-11-03T10:30:00.000Z',
      start: '2021-11-03T10:00:00.000Z',
      end: '2021-11-03T10:30:00.000Z',
    },
    {
      date: '2021-11-04T18:00:00.000Z',
      start: '2021-11-05T11:00:00.000Z',
      end: '2021-11-05T11:30:00.000Z',
    },
    {
      date: '2021-11-03T12:00:00.000Z',
      start: '2021-11-03T12:00:00.000Z',
      end: '2021-11-03T12:00:00.000Z',
    },
  ];

  test.each(dataOutOfRange)(
    'returns false for given date when out of time range',
    data => {
      expect(dateInTimeRange(data)).toBeFalsy();
    },
  );
});

describe('getUsersWithAvailabilityMatch', () => {
  const defaultAvailableChats = [
    { start: '2022-10-03T12:30:00.000Z', day: 0 },
    { start: '2022-01-03T13:00:00.000Z', day: 0 },
    { start: '2022-11-03T13:30:00.000Z', day: 1 },
    { start: '2021-11-03T10:00:00.000Z', day: 3 },
    { start: '2021-11-03T10:30:00.000Z', day: 3 },
    { start: '2021-11-03T11:00:00.000Z', day: 3 },
    { start: '2021-11-03T19:00:00.000Z', day: 3 },
    { start: '2021-11-05T12:00:00.000Z', day: 4 },
  ];

  const availabilities = [
    {
      start: '2021-11-03T11:00:00.000Z',
      end: '2021-11-03T13:00:00.000Z',
      dayIndex: 3,
      userId: 1,
    },
    {
      start: '2021-11-03T11:00:00.000Z',
      end: '2021-11-03T13:00:00.000Z',
      dayIndex: 5,
      userId: 1,
    },
    {
      start: '2021-11-03T17:00:00.000Z',
      end: '2021-11-03T19:00:00.000Z',
      dayIndex: 3,
      userId: 2,
    },
    {
      start: '2021-11-03T11:00:00.000Z',
      end: '2021-11-03T19:00:00.000Z',
      dayIndex: 2,
      userId: 3,
    },
  ];

  test('returns empty array if availabilities is undefined', () => {
    expect(
      getUsersWithAvailabilityMatch({
        availableChats: defaultAvailableChats,
      }),
    ).toEqual([]);
  });

  test('returns empty array if availableChats is undefined', () => {
    expect(getUsersWithAvailabilityMatch({ availabilities })).toEqual([]);
  });

  test('returns user1 only', () => {
    expect(
      getUsersWithAvailabilityMatch({
        availableChats: defaultAvailableChats,
        availabilities,
      }),
    ).toEqual([1]);
  });

  test('returns user1 and user2 only', () => {
    expect(
      getUsersWithAvailabilityMatch({
        availableChats: [
          ...defaultAvailableChats,
          { start: '2021-11-03T17:00:00.000Z', day: 3 },
        ],
        availabilities,
      }),
    ).toEqual([1, 2]);
  });

  test('returns user1 and user3 only', () => {
    expect(
      getUsersWithAvailabilityMatch({
        availableChats: [
          ...defaultAvailableChats,
          { start: '2021-11-03T12:00:00.000Z', day: 2 },
        ],
        availabilities,
      }),
    ).toEqual([1, 3]);
  });

  test('returns empty array as no matches', () => {
    expect(
      getUsersWithAvailabilityMatch({
        availableChats: [
          { start: '2021-11-03T12:00:00.000Z', day: 6 },
          { start: '2021-11-03T10:30:00.000Z', day: 6 },
          { start: '2021-11-03T12:00:00.000Z', day: 6 },
        ],
        availabilities,
      }),
    ).toEqual([]);
  });
});
