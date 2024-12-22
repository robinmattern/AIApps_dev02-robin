import { describe, it } from 'vitest';
import transformer from '../codemods/replace-token-usage-types';
import { testTransform } from './test-utils';

describe('replace-token-usage-types', () => {
  it('transforms correctly', () => {
    testTransform(transformer, 'replace-token-usage-types');
  });
});
