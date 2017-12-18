let mockPayload;
let mockDelay;
let mockError;
let mockResponse;

const Request = jest.fn(() => {
  return {
    post: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    send: jest.fn((payload) => {
      mockPayload = payload;
      return this;
    }),
    ok: jest.fn().mockReturnThis(),
    query: jest.fn().mockReturnThis(),
    field: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    accept: jest.fn().mockReturnThis(),
    timeout: jest.fn().mockReturnThis(),
    end: jest.fn((callback) => {
      if (mockDelay) {
        setTimeout(callback, 0, mockError, mockResponse);
        return;
      }
      callback(mockError, mockResponse);
    }),
  };
});

// Expose helper methods for tests to set

Request.__getMockPayload = () => {
  return mockPayload;
};
Request.__getMockResponse = () => {
  return mockResponse;
};
Request.__getMockError = () => {
  return mockError;
};
Request.__setMockDelay = (boolValue) => {
  mockDelay = boolValue;
};
Request.__setMockResponse = (res) => {
  mockResponse = res;
};
Request.__setMockError = (err) => {
  mockError = err;
};

module.exports = Request;
