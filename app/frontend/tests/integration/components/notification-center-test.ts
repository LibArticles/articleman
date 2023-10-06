import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | notification-center', function (hooks) {
	setupRenderingTest(hooks);

	test('it renders', async function (assert) {
		// Set any properties with this.set('myProperty', 'value');
		// Handle any actions with this.set('myAction', function(val) { ... });

		await render(hbs`<NotificationCenter />`);

		assert.dom().hasText('');

		// Template block usage:
		await render(hbs`
      <NotificationCenter>
        template block text
      </NotificationCenter>
    `);

		assert.dom().hasText('template block text');
	});
});
