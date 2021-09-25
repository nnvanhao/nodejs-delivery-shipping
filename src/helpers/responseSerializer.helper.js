const RESOURCES = require('../constants/baseApiResource.constant');

const singleResourceResponse = (data, resource) => {
    return {
        data: data,
        meta: {
            type: resource,
        }
    }
}

const collectionResourceResponse = (data, resource) => {
    const items = createListItems(data);

    return {
        items: items,
        meta: {
            type: resource,
            count: items.length
        }
    };
}

const createListItems = (data) => {
    const items = [];
    data.forEach(function (item) {
        items.push(item);
    });
    return items;
}

const formatResponse = (results, resource) => {
    const formattedResponse = Array.isArray(results)
        ? collectionResourceResponse(results, resource)
        : singleResourceResponse(results, resource);
    return formattedResponse;
}

module.exports = {
    formatResponse
};