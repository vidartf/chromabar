// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Application, IPlugin
} from '@phosphor/application';

import {
  Widget
} from '@phosphor/widgets';

import {
  IJupyterWidgetRegistry
 } from '@jupyter-widgets/base';

import {
  ColorBarModel, ColorBarView
} from './widget';

import {
  EXTENSION_SPEC_VERSION
} from './version';

const EXTENSION_ID = 'jupyter-colorbar';


/**
 * The color bar plugin.
 */
const colorbarPlugin: IPlugin<Application<Widget>, void> = {
  id: EXTENSION_ID,
  requires: [IJupyterWidgetRegistry],
  activate: activateWidgetExtension,
  autoStart: true
};

export default colorbarPlugin;


/**
 * Activate the widget extension.
 */
function activateWidgetExtension(app: Application<Widget>, registry: IJupyterWidgetRegistry): void {
  registry.registerWidget({
    name: 'jupyter-colorbar',
    version: EXTENSION_SPEC_VERSION,
    exports: {
      ColorBarModel: ColorBarModel,
      ColorBarView: ColorBarView
    }
  });
}
