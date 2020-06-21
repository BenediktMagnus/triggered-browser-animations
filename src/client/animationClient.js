/* global io */

/**
* @typedef {
   {
       html: string,
       tokens: Object.<string, string>|undefined
   }
} Animation
*/

/* exported AnimationClient */
/**
 * The AnimationClient listens for animation triggers and plays them.
 */
class AnimationClient
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
     * Run the client and listen for animation triggers.
     * @param {HTMLElement} targetElement
     */
    run (targetElement)
    {
        this.targetElement = targetElement;

        this.socket.connect();
    }

    /**
     * To be called when an anmation is triggered.
     * @param {Animation} animation
     */
    onPlayAnimation (animation)
    {
        if (this.targetElement === undefined)
        {
            return;
        }

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
                const tokens = animation.tokens ? animation.tokens : {};

                const tokenedHtml = this.replaceTokens(xhr.response, tokens);

                this.targetElement.innerHTML = tokenedHtml;
            }
        };

        xhr.send();
    }

    /**
     * Replace all tokens in a given HTML string.
     * @param {string} html
     * @param {Object.<string, string>} tokens
     * @returns {string} The HTML with all tokens replaced.
     */
    replaceTokens (html, tokens)
    {
        let result = html;

        for (const [key, value] of Object.entries(tokens))
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
