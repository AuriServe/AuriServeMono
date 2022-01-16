import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import renderToString from 'preact-render-to-string';
declare global {
    export interface AuriServeAPI {
        preact: {
            preact: typeof preact;
            hooks: typeof hooks;
            forwardRef: typeof forwardRef;
            renderToString: typeof renderToString;
        };
    }
}