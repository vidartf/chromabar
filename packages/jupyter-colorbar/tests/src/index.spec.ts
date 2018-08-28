// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import {
  WidgetModel
} from '@jupyter-widgets/base';

import {
  createTestModel
} from './utils.spec';

import {
  ColorBarModel, ColorBarView
} from '../../src/'


describe('ColorBar', () => {

  describe('ColorBarModel', () => {

    it('should be createable', () => {
      let model = createTestModel(ColorBarModel);
      expect(model).to.be.an(ColorBarModel);
      expect(model.get('colorbar')).to.be(null);
    });

  });

});
