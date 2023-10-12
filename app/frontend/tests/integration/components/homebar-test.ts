import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | homebar', function (hooks) {
	setupRenderingTest(hooks);

	test('it renders', async function (assert) {
		// Set any properties with this.set('myProperty', 'value');
		// Handle any actions with this.set('myAction', function(val) { ... });

		await render(hbs`<Homebar />`);

		assert.dom().hasText('');

		// Template block usage:
		await render(hbs`
      <Homebar>
        template block text
      </Homebar>
    `);

		assert.dom().hasText('template block text');
	});
});
