#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Vidar Tonaas Fauske.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, widget_serialization
from traitlets import Unicode, Instance, Enum, Float, Int, Any
from ipyscales import ScaleWidget
from ._version import EXTENSION_SPEC_VERSION

try:
    from ipywidgets.widgets.trait_types import TypedTuple
except ImportError:
    from traitlets import Container

    class TypedTuple(Container):
        """A trait for a tuple of any length with type-checked elements."""
        klass = tuple
        _cast_types = (list,)

module_name = "jupyter-colorbar"


class ColorBar(DOMWidget):
    """A color bar widget, representing an ipyscales color map"""

    _model_name = Unicode('ColorBarModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _view_name = Unicode('ColorBarView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    colormap = Instance(ScaleWidget, allow_none=False).tag(sync=True, **widget_serialization)

    orientation = Enum(('vertical', 'horizontal'), 'vertical').tag(sync=True)
    side = Enum(('bottomright', 'topleft'), 'bottomright').tag(sync=True)
    length = Int(100, min=2).tag(sync=True)
    breadth = Int(30, min=1).tag(sync=True)
    border_thickness = Float(1.0).tag(sync=True)
    title = Unicode(None, allow_none=True).tag(sync=True)
    title_padding = Int(30).tag(sync=True)
    axis_padding = Int(None, allow_none=True).tag(sync=True)
    
    tickArguments = TypedTuple(Any(), ()).tag(sync=True)
    tickValues = TypedTuple(Any(), None, allow_none=True).tag(sync=True)
    tickFormat = TypedTuple(Any(), None, allow_none=True).tag(sync=True)
    tickSizeInner = Float(6).tag(sync=True)
    tickSizeOuter = Float(6).tag(sync=True)
    tickPadding = Float(3).tag(sync=True)

    ticks = Int(10)



class ColorMapEditor(DOMWidget):
    """A color bar widget, representing an ipyscales color map"""

    _model_name = Unicode('ColorMapEditorModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _view_name = Unicode('ColorMapEditorView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    colormap = Instance(ScaleWidget, allow_none=False).tag(sync=True, **widget_serialization)

    orientation = Enum(('vertical', 'horizontal'), 'vertical').tag(sync=True)
    length = Int(100, min=2).tag(sync=True)
    breadth = Int(30, min=1).tag(sync=True)
    border_thickness = Float(1.0).tag(sync=True)
