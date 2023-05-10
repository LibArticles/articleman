export function initialize(application) {
  application.inject('route', 'casement', 'service:casement');
}

export default {
  initialize,
};
