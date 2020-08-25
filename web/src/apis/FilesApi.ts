import ApiDirector from './ApiDirector';
import BodyLessApiRequestCallBuilder from './apiBuilders/BLApiRequestCallBuilder';
import { METHODS, validServicesToCall } from './apiBuilders/requestEnums';
import { handleResponse } from 'functions/apiCalls';
import { getDomain } from './apiHelpers';

export default class FilesApi extends ApiDirector {
  async getFilesPerProject(projectId: number, path: string, recursive = false, branch: string) {
    const baseUrl = `/api/v4/projects/${projectId}/repository/tree`;
    const blBuilder = new BodyLessApiRequestCallBuilder(METHODS.GET, this.buildBasicHeaders(validServicesToCall.GITLAB), baseUrl);
    const params = new Map();
    params.set('ref', branch);
    params.set('recursive', recursive);
    params.set('path', path);
    params.set('per_page', '50');
    blBuilder.setUrlParams(params);
    blBuilder.buildUrlWithParams();
    const response = await fetch(blBuilder.build());
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  }

  async getFileData(projectId: number, path: string, branch: string) {
    const url = `${getDomain()}/api/v4/projects/${projectId}/repository/files/${path}?ref=${branch}`;
    const blBuilder = new BodyLessApiRequestCallBuilder(METHODS.GET, this.buildBasicHeaders(validServicesToCall.GITLAB), url);
    const response = await fetch(blBuilder.build());
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  }

  getContributors(projectId: number) {
    const url = `/api/v4/projects/${projectId}/repository/contributors`;
    const headers = this.buildBasicHeaders(validServicesToCall.GITLAB);
    const builder = new BodyLessApiRequestCallBuilder(METHODS.GET, headers, url);

    return fetch(builder.build())
      .then(handleResponse);
  }
}
