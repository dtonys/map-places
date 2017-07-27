import {
  createStore as reduxCreateStore,
  applyMiddleware,
} from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from 'redux-modules/rootReducer';
import sagaPromiseMiddleware from 'redux-modules/middleware/sagaPromiseMiddlware';

function createStore( initialState ) {
  const middleware = [];

  if ( __DEVELOPMENT__ ) {

    const loggerIgnoredActionTypes = [
      'OMIT_THIS_ACTION',
    ];

    const cloneWithBind = (obj) => {
      const clone = {};
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'function') {
          clone[key] = obj[key].bind(obj);
        }
        else {
          clone[key] = obj[key];
        }
      });
      return clone;
    };

    let rootPath;
    if (__SERVER__) {
      rootPath = require('path').resolve(__dirname, '../../../../../', './.next/dist');
    }

    const cleanupTrace = (trace) => {
      trace = String(trace || '');

      // Drop the first line and a few stack frames that aren't informative.
      trace = trace.replace(/^(.*\n){6}/, '');

      // Unindent.
      trace = trace.replace(/^\s+at\s+/gm, '@ ');

      // Remove absolute paths, reads better and less clutter in the log.
      if (__SERVER__) {
        trace = trace.replace(new RegExp(rootPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '.');
      }

      return trace;
    };

    let groupsOpen = 0;
    const reduxLoggerOptions = {
      predicate: ( getState, action ) => (
        !(action && loggerIgnoredActionTypes.indexOf(action.type) >= 0)
      ),
      stateTransformer: ( state ) => (
        ( __SERVER__
          ? '(state output silenced on __SERVER__)'
          : state
        )
      ),
      level: 'log',
      logger: ( __SERVER__
        ? {
          log: console.log.bind(console), // eslint-disable-line no-console
          group: (...args) => {
            const chalk = require('chalk');
            chalk.enabled = true;
            console.log('\n' + chalk.bold.blue('[redux/logger]')); // eslint-disable-line no-console
            console.group(...args); // eslint-disable-line no-console
            ++groupsOpen;
          },
          groupEnd: (...args) => {
            --groupsOpen;

            if (groupsOpen === 0) {
              // Show the stack trace in a subgroup.
              console.group('trace'); // eslint-disable-line no-console
              console.log(cleanupTrace(new Error().stack)); // eslint-disable-line no-console
              console.groupEnd(); // eslint-disable-line no-console
            }

            // Call the original `groupEnd`.
            console.groupEnd(...args); // eslint-disable-line no-console
            console.log('\n'); // eslint-disable-line no-console
          },
        }
        : {
          ...cloneWithBind(window.console || {
            log: () => {},
          }),
          group: (...args) => {
            // Call the original `group`.
            if (window.console.group) {
              window.console.group(...args);
            }
            ++groupsOpen;
          },
          groupCollapsed: (...args) => {
            // Call the original `groupCollapsed`.
            if (window.console.groupCollapsed) {
              window.console.groupCollapsed(...args);
            }
            ++groupsOpen;
          },
          groupEnd: (...args) => {
            --groupsOpen;

            if (groupsOpen === 0) {
              // Show the stack trace in a subgroup.
              if (window.console.groupCollapsed) {
                window.console.groupCollapsed('trace');
              }
              else if (window.console.group) {
                window.console.group('trace');
              }
              if (window.console.log) {
                window.console.log(cleanupTrace(new Error().stack));
              }
              if (window.console.groupEnd) {
                window.console.groupEnd();
              }
            }

            // Call the original `groupEnd`.
            if (window.console.groupEnd) {
              window.console.groupEnd(...args);
            }
          },
        }
      ),
      diff: true,
      collapsed: ( __SERVER__ ? false : true ), // eslint-disable-line no-unneeded-ternary
    };

    if ( __SERVER__ ) {
      // NOTE: Do not override `colors` with `undefined`, `redux-logger` does not handle default values well.
      reduxLoggerOptions.colors = {
        title: false,
        prevState: false,
        action: false,
        nextState: false,
        error: false,
      };
    }

    middleware.push( createLogger(reduxLoggerOptions) );
  }

  // saga
  const sagaMiddleware = createSagaMiddleware();
  middleware.push( sagaPromiseMiddleware );
  middleware.push( sagaMiddleware );
  const store = reduxCreateStore(
    rootReducer,
    initialState,
    applyMiddleware( ...middleware ),
  );

  return { store, sagaMiddleware };
}

export default createStore;
