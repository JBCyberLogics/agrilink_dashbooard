import { describe, expect, it } from 'vitest';
import { validateLoginCredentials } from './validateLoginCredentials';

describe('validateLoginCredentials', () => {
  it('requires a non-empty username and password', () => {
    expect(validateLoginCredentials({ username: '', password: '' })).toEqual({
      username: 'Enter your username.',
      password: 'Enter your password.',
    });
    expect(validateLoginCredentials({ username: '   ', password: 'secret' })).toEqual({
      username: 'Enter your username.',
    });
    expect(validateLoginCredentials({ username: 'operator', password: '' })).toEqual({
      password: 'Enter your password.',
    });
  });

  it('does not claim to check whether credentials are valid', () => {
    expect(validateLoginCredentials({ username: 'operator', password: 'any value' })).toEqual({});
  });
});
