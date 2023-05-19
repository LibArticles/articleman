const Backend = new Proxy({}, {
  get: function(target, propKey, receiver) {
    // @ts-ignore
      const origMethod = target[propKey];
      return function (...args: any[]) {
          console.log(propKey); // logs the property name
          return new Promise((resolve, reject) => {
            // @ts-ignore
              google.script.run.withSuccessHandler(resolve).withFailureHandler(reject)[propKey](...args);
          });
      };
  }
});

export default Backend;