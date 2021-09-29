const RESOURCES = require('../constants/baseApiResource.constant');

const singleResourceResponse = (data, resource) => {
    return {
        data: data,
        meta: {
            type: resource,
        }
    }
}

const collectionResourceResponse = (data, resource, total) => {
    const items = createListItems(data);

    return {
        items: items,
        meta: {
            type: resource,
            count: items.length,
            total
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

const formatResponse = (results, resource, total) => {
    const formattedResponse = Array.isArray(results)
        ? collectionResourceResponse(results, resource, total)
        : singleResourceResponse(results, resource);
    return formattedResponse;
}

module.exports = {
    formatResponse
};