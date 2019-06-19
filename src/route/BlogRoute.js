const _p = new WeakMap();

class BlogRoute {
  constructor({ path, validPostNames }) {
    _p.set(this, {});
    this.path = path;
    this.validPostNames = validPostNames;
  }

  static checkReq(req) {
    if (typeof req.url !== 'string') throw new Error('req.url must be a string');
  }

  get path() {
    return _p.get(this).path;
  }
  set path(path) {
    if (typeof path !== 'string') throw new Error('Path must be a string');
    _p.get(this).path = path;
  }

  get validPostNames() {
    return _p.get(this).validPostNames;
  }
  set validPostNames(list) {
    if (list.constructor !== Array) throw new Error('Post names should be an array');
    _p.get(this).validPostNames = list;
  }

  matches(req) {
    BlogRoute.checkReq(req);
    const { url, method } = req;
    return method === 'GET'
      && url.indexOf(this.path) === 0;
  }

  getRequestedPostName(req) {
    BlogRoute.checkReq(req);
    const [, postName] = req.url.split(this.path);
    return postName;
  }

  isValid(req) {
    return this.validPostNames.indexOf(this.getRequestedPostName(req)) >= 0;
  }
}

export default BlogRoute;