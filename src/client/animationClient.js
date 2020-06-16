/* global io */

export default class AnimationClient
{
    /**
     * @param {string} namespace
     */
    constructor (namespace = '/animations')
    {
        this.socket = io(namespace);

        this.socket.on('play', this.onPlayAnimation.bind(this));

        /** @type {HTMLElement} */
        this.targetElement = undefined;
    }

    /**
     * @param {HTMLElement} targetElement
     */
    run (targetElement)
    {
        this.targetElement = targetElement;

        this.socket.connect();
    }

    onPlayAnimation (animation)
    {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', animation.html);

        xhr.onload = () =>
        {
            if (xhr.status != 200)
            {
                console.error(`Cannot play animation "${animation.html}". Received status code ${xhr.status} with text "${xhr.statusText}".`);
            }
            else
            {
                const tokenedHtml = this.replaceTokens(xhr.response, animation);

                if (this.targetElement !== undefined)
                {
                    this.targetElement.innerHTML = tokenedHtml;
                }
            }
        };

        xhr.send();
    }

    /**
     * @param {string} html
     * @param {*} animation
     */
    replaceTokens (html, animation)
    {
        let result = html;

        for (const [key, value] of Object.entries(animation))
        {
            if (key !== 'html')
            {
                const findRegex = new RegExp('\\{\\{' + key + '\\}\\}', 'g');

                result = result.replace(findRegex, value);
            }
        }

        return result;
    }
}
