const { i18nService } = require('../config');

const cartMessage = () => {
  return {
    CREATE_SUCCESS: i18nService.translate('order', 'createSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('order', 'findListSuccess'),
    UPDATE_SUCCESS: i18nService.translate('order', 'updateSuccess'),
    NOT_FOUND: i18nService.translate('cart', 'notFound'),
  };
};

module.exports = cartMessage;
