import { module, test } from 'qunit';

import { setupTest } from 'frontend/tests/helpers';

module('Unit | Model | skill', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('skill', {});
    assert.ok(model);
  });
});
