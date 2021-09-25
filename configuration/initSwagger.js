const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

exports.initSwagger = function (app) {
    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: 'NodeJS Express Structure Swagger API',
                version: '1.0.0',
                description: 'API Information',
                contact: {
                    name: 'nnvanhao',
                    email: 'nnvanhao.dev@gmail.com',
                    url: 'https://nnvanhao.com',
                },
                license: {
                    name: 'Apache 2.0',
                    url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
                },
                servers: ['http://localhost:3600'],
            },
            tags: [
			{
				name: 'Auth',
				description: 'Authentication apis',
			},
		],
            schemes: ['http'],
            // basePath: '/api/v1',
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    description: 'JWT authorization of an API',
                    name: 'Authorization',
                    in: 'header',
                },
            },
        },
        apis: [
            './src/routes/common.routes.js',
            './src/routes/authorization/authorization.routes.js',
        ],
    };
    const swaggerDocs = swaggerJSDoc(swaggerOptions);
    const Validator = require('swagger-model-validator');
    const validator = new Validator(swaggerDocs);

    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};