#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Vidar Tonaas Fauske.
# Distributed under the terms of the Modified BSD License.

import pytest

from ipyscales import LinearScaleWidget

from ..widgets import ColorBar


def test_colorbar_creation_blank():
    with pytest.raises(ValueError):
        ColorBar()

def test_colorbar_creation():
    colormap = LinearScaleWidget(range=('red', 'blue'))
    w = ColorBar(colormap=colormap)
    assert w.colormap is colormap
