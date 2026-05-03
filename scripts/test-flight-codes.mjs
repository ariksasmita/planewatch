import assert from 'node:assert/strict'
import { getFlightCodeVariants, normalizeFlightCode } from '../utils/flightCodes.ts'

assert.equal(normalizeFlightCode(' dl 496 '), 'DL496')
assert.deepEqual(getFlightCodeVariants('GA401'), ['GA401', 'GIA401'])
assert.deepEqual(getFlightCodeVariants('DL496'), ['DL496', 'DAL496'])
assert.deepEqual(getFlightCodeVariants('GIA401'), ['GIA401'])
assert.deepEqual(getFlightCodeVariants('VN123'), ['VN123', 'HVN123'])
assert.deepEqual(getFlightCodeVariants('ZZ9999'), ['ZZ9999'])

console.log('flight code utility tests passed')
