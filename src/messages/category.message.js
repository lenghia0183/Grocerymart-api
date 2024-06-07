const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    CREATE_SUCCESS: i18nService.translate('category', 'createSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('category', 'findSuccess'),
    FIND_SUCCESS: i18nService.translate('category', 'findSuccess'),
    UPDATE_SUCCESS: i18nService.translate('category', 'updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('category', 'deleteSuccess'),
  };
};

module.exports = categoryMessage;
