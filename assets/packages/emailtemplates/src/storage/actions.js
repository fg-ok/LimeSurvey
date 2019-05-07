import ajax from '../mixins/runAjax.js';
import _ from 'lodash';
import {LOG} from '../mixins/logSystem.js'

export default {
    getDataSet: (context) => {
        return new Promise((resolve, reject) => {
            const subAction = window.EmailTemplateData.connectorBaseUrl.slice(-1) == '=' ? 'getEmailTemplateData' : '/getEmailTemplateData';
            ajax.methods.$_get(
                window.EmailTemplateData.connectorBaseUrl+subAction
            ).then((result) => {
                LOG.log('Getting Data', result);
                
                context.commit('setTemplateTypes', result.data.templateTypes);
                context.commit('setCurrentTemplateType', _.keys(result.data.templateTypes)[0]);
                context.commit('setLanguages', result.data.languages);
                context.commit('setActiveLanguage', _.keys(result.data.languages)[0]);

                context.commit('setTemplateTypeContents', result.data.templateTypeContents);
                context.commit('setPermissions', result.data.permissions);
                resolve();
            }, reject);
        });
    },
    saveData: (context) => {
        let transferObject = _.merge({changes: context.state.templateTypeContents}, window.LS.data.csrfTokenData);

        LOG.log('OBJECT TO BE TRANSFERRED: ', {'postObject': transferObject});
        const subAction = window.EmailTemplateData.connectorBaseUrl.slice(-1) == '=' ? 'saveEmailTemplateData' : '/saveEmailTemplateData';
        return ajax.methods.$_post(window.EmailTemplateData.connectorBaseUrl+subAction, transferObject)
    }
};