#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Vidar Tonaas Fauske.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, widget_serialization
from traitlets import Unicode, Instance
from ipyscales import ScaleWidget
from ._version import EXTENSION_SPEC_VERSION

module_name = "jupyter-colorbar"


class ColorBar(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('ColorBarModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _view_name = Unicode('ColorBarView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    colormap = Instance(ScaleWidget, allow_none=False).tag(sync=True)
