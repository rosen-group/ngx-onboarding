// Jasmine restored spies automatically after each spec; Vitest needs this explicitly.
afterEach(() => {
    vi.restoreAllMocks();
});
