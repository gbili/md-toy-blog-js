import fs from 'fs';
import BaseController from './BaseController';
import TemplateEngine from '../util/TemplateEngine';

class HtmlTemplateController extends BaseController {
  constructor(config) {
    super(config);
    this.loadViewTemplate = this.loadViewTemplate.bind(this);
    this.hydrateView = this.hydrateView.bind(this);
  }

  getViewBaseName() {
    const fullName = this.constructor.name;
    return fullName
      .substring(0, fullName.length - 'Controller'.length)
      .toLowerCase();
  }

  loadViewTemplate(viewData) {
    const viewsPath = (typeof this.config.viewsPath !== 'undefined')
      ? this.config.viewsPath
      : `${__dirname}/../view`;
    const filepath = `${viewsPath}/${this.getViewBaseName()}-${this.action}.html`;
    return new Promise(function(resolve, reject) {
      fs.readFile(filepath, 'utf-8', function(err, viewTemplate) {
        if (err) return reject(err);
        resolve({viewTemplate, viewData});
      });
    });
  }

  hydrateView({viewTemplate, viewData}) {
    const configViewData = this.config.viewData || {};
    const missingRefValueReplacement = this.config.missingRefValueReplacement || (ref => `Missing ref: ${ref}`);
    viewData = {...configViewData, ...viewData};
    const hydratedView = TemplateEngine.hydrate(viewTemplate, viewData, missingRefValueReplacement);
    this.response.code = 200;
    this.response.headers = {'content-type': 'text/html; charset=utf-8'};
    this.response.body = hydratedView;
    return this.response;
  }
}

export default HtmlTemplateController;
