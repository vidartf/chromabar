// Copyright (c) Vidar Tonaas Fauske.
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers, unpack_models
} from '@jupyter-widgets/base';

import {
  chromabar
} from 'chromabar';


import { select } from 'd3-selection';

import {
  EXTENSION_SPEC_VERSION
} from './version';


export
class ColorBarModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: ColorBarModel.model_name,
      _model_module: ColorBarModel.model_module,
      _model_module_version: ColorBarModel.model_module_version,
      _view_name: ColorBarModel.view_name,
      _view_module: ColorBarModel.view_module,
      _view_module_version: ColorBarModel.view_module_version,
      colormap : null
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      colormap: {deserialize: unpack_models}
    }

  static model_name = 'ColorBarModel';
  static model_module = 'jupyter-colorbar';
  static model_module_version = EXTENSION_SPEC_VERSION;
  static view_name = 'ColorBarView';
  static view_module = 'jupyter-colorbar';
  static view_module_version = EXTENSION_SPEC_VERSION;
}


export
class ColorBarView extends DOMWidgetView {
  render() {
    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
  }

  value_changed() {
    const barFunc = chromabar(this.model.get('colormap'));
    let sel = select(this.el).selectAll('svg');
    sel = sel.merge(sel.enter().append('svg'));
    sel.call(barFunc);
  }
}
