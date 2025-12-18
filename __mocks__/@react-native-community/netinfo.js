const mockState = {
  type: 'wifi',
  isConnected: true,
  isInternetReachable: true,
  details: null,
};

const NetInfoMock = {
  addEventListener: (handler) => {
    if (typeof handler === 'function') {
      handler({ ...mockState });
    }
    return () => {};
  },
  fetch: () => Promise.resolve({ ...mockState }),
  configure: () => {},
  useNetInfo: () => ({ ...mockState }),
};

module.exports = NetInfoMock;
module.exports.default = NetInfoMock;


