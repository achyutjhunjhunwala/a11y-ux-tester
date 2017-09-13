import sanitizeObject from './sanitizeObject';

describe('sanitizeObject Spec', () => {
  test('sanitizeObject: should sanitize object by removing `undefined` properties', () => {
    const objectToSanitize = {
      a: 1,
      b: undefined,
    };

    expect(sanitizeObject(objectToSanitize)).toEqual({
      a: 1,
    });
  });
});
