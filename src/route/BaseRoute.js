class BaseRoute {
  constructor(path, request, params) {
    this.path = path;
    this.params = params;
    this.request = request;

    const subclassesMustImplement = [
      'getController',
      'getAction',
      'getParams',
      'matches',
      'isValid',
    ];
    subclassesMustImplement.map( methodName => {
      if (typeof this[methodName] !== 'function') {
        throw new TypeError(
          `BaseRoute sublass ${this.constructor.name} must override getController`
        );
      }
    });
  }

  canResolve(req) {
    req = req || this.request;
    return this.matches(req) && this.isValid(req);
  }
}

export default BaseRoute;
