# PinchZoom.js

PinchZoom is a Javascript library providing multi-touch gestures for zooming and dragging on any DOM element.

## Usage

### Requirements
* No dependencies, built with vanilla JS.
* A modern browser (ECMA 5 support, http://caniuse.com/use-strict).

### Initialisation

```Javascript

let el = document.querySelector('#my-id');
let pz = new PinchZoom(el, options);

```

### Options

```Text

tapZoomFactor:      Zoom factor that a double tap zooms to. (default 2)
zoomOutFactor:      Resizes to original size when zoom factor is below this value. (default 1.3)
animationDuration:  Animation duration in milliseconds. (default 300)
maxZoom:            Maximum zoom factor. (default 4)
minZoom:            Minimum zoom factor. (default 0.5)
draggableUnzoomed:  Capture drag events even when the image isn't zoomed. (default true)
                    (using `false` allows other libs (e.g. swipe) to pick up drag events)
lockDragAxis:       Lock panning of the element to a single axis. (default false)
setOffsetsOnce:     Compute offsets (image position inside container) only once. (default false)
                    (using `true` maintains the offset on consecutive `load` and `resize`)
use2d:              Fall back to 2D transforms when idle. (default true)
                    (a truthy value will still use 3D transforms during animation)
verticalPadding:    Vertical padding to apply around the image. (default 0)
horizontalPadding:  Horizontal padding to apply around the image. (default 0)
```

### Events

Pinchzoom emits some custom events you can listen to:

```Text

pz_zoomstart  Started to zoom
pz_zoomend    Stopped zooming
pz_zoomupdate Zoom factor updated
pz_dragstart  Started to drag the element
pz_dragend    Stopped to drag the element
pz_dragupdate Drag position updated
pz_doubletap  Resetting the zoom with double-tap

```

_(if need be, the event names can be customized via `options`)_

### Methods

```Javascript
let pz = new PinchZoom(myElement);

pz.enable(); // Enables all gesture capturing (is enabled by default)
pz.disable(); // Disables all gesture capturing

```

### Release a New Version

1. Make a bump commit (update package.json, package-lock.json, src and dist)
2. Create a new tag `git tag -m "v2.2.0" v2.2.0`
3. Release new NPM version (`npm whoami; npm publish`)
4. Push the code + the tag to Github (`git push origin v2.2.0`)
4. Make a new Github release (https://github.com/manuelstofer/pinchzoom/releases)

### Troubleshooting

- If you have issues with invisible images, make sure that the image isn't absolutely positioned.
  In some cases that will cause trouble.

## License

Licensed under the [MIT License](http://opensource.org/licenses/MIT).

## Github Page with demo

https://manuelstofer.github.com/pinchzoom/