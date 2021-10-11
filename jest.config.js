module.exports = {
    coverageReporters: ['text', 'lcov', 'jest-badges'],
    collectCoverage: true,
    collectCoverageFrom: ['src/AsyncState.ts', 'src/State.ts'],
};
