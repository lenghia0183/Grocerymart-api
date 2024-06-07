const { i18nService } = require('../config');

const manufacturerMessage = () => {
  return {
    CREATE_SUCCESS: i18nService.translate('manufacturer', 'createSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('manufacturer', 'findSuccess'),
    FIND_SUCCESS: i18nService.translate('manufacturer', 'findSuccess'),
    UPDATE_SUCCESS: i18nService.translate('manufacturer', 'updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('manufacturer', 'deleteSuccess'),
  };
};

module.exports = manufacturerMessage;
