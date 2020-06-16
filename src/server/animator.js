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
        this.options = Object.assign({}, defaultOptions, options);

        // Serve animation files:
        this.express.use(this.options.urlPath, express.static(this.options.folderPath));

        const clientFilesPath = path.join(path.dirname(__dirname), 'client');

        // Serve client script files:
        this.express.use(
            this.options.urlPath + '/client',
            express.static(clientFilesPath, {extensions: ['js']})
        );

        // Set namespace for socket.io:
        this.io.of(options.namespace);
    }

    play (animation)
    {
        this.io.of(this.options.namespace).emit('play', animation);
    }
}

module.exports = Animator;
