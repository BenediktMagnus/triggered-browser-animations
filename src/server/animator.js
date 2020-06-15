const express = require('express');
const path = require('path');

const defaultOptions = {
    folderPath: './animations',
    urlPath: '/animations',
    namespace: '/animations',
};

class Animator
{
    /**
     * @param {express.Express} expressServer
     * @param {SocketIO.Server} io
     * @param {defaultOptions} options
     */
    constructor (expressServer, io, options = defaultOptions)
    {
        this.express = expressServer;
        this.io = io;

        // Add default values for the missing options:
        const actualOptions = Object.assign({}, defaultOptions, options);

        // Serve animation files:
        this.express.use(actualOptions.urlPath, express.static(actualOptions.folderPath));

        const clientFilesPath = path.join(path.basename(__dirname), 'client');

        // Serve client script files:
        this.express.use(
            actualOptions.urlPath + '/client',
            express.static(clientFilesPath, {extensions: ['js']})
        );

    }
}

module.exports = Animator;
