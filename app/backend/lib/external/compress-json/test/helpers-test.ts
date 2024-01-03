import { trimUndefined, trimUndefinedRecursively } from '../src/helpers'

function assert(condition: boolean) {
  if (!condition) {
    console.error(new Error('Assertion failed'))
    process.exit(1)
  }
}

const user: any = {
  name: 'Alice',
  role: undefined,
}
trimUndefined(user)
if ('role' in user) {
  console.error('undefined field is not removed')
  process.exit(1)
}
assert(user.name === 'Alice')

const a = {
  name: 'a',
  b: undefined as any,
  extra: undefined,
}
const b = {
  name: 'b',
  a,
}
a.b = b

trimUndefinedRecursively(b)
if ('extra' in b.a) {
  console.error('undefined field is not removed recursively')
  process.exit(1)
}

assert(a.name === 'a')
assert(a.b === b)
assert(b.name === 'b')
assert(b.a === a)

console.log('pass: helpers.ts')
