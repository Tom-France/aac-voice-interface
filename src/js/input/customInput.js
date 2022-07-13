import {inputEventHandler} from "./inputEventHandler";
import $ from "../externals/jquery.js";
import {actionService} from "../service/actionService";

let CustomInput = {};
let _destroyCallback = null;

CustomInput.getInstanceFromConfig = function (paramItemSelector) {
    return new CustomInputConstructor(paramItemSelector, {
        multiKeysEventSelect: new Map([
            ["77:79:84", "Home"],
            ["8", "Clear"],
            ["80", "Play"]
        ])
    });
};

function CustomInputConstructor(paramItemSelector, options) {
    let thiz = this;

    let scanActiveClass = paramItemSelector;

    //internal
    let _started = false;
    let _elements = null;
    let _currentElement = null;
    let _selectionListener = null;
    let _inputEventHandler = inputEventHandler.instance();
    let _pressedKeys = new Set()

    thiz.startCustom = function () {
        _started = true;
        _inputEventHandler.startListening();
        document.addEventListener('keydown', customKeyboardListener);
        document.addEventListener('keyup', customKeyUpListener);
    };

    thiz.stop = function () {
        _started = false;
        document.removeEventListener('keydown', customKeyboardListener);
        document.removeEventListener('keyup', customKeyUpListener);
        _inputEventHandler.stopListening();
    };

    thiz.destroy = function () {
        if (_destroyCallback) {
            _destroyCallback();
            _destroyCallback = null;
        }
        document.removeEventListener('keydown', customKeyboardListener);
        document.removeEventListener('keyup', customKeyUpListener);
        _inputEventHandler.destroy();
    };

    thiz.reinit = function() {
        if (!_started) {
            return;
        }
        thiz.stop();
        init();
        thiz.start();
    };

    thiz.select = function () {
        if (options.multiKeysEventSelect.has(stringifyPressedKeys())) {
            _elements = $(`[data-custom-id="${options.multiKeysEventSelect.get(stringifyPressedKeys())}"]`)
            setActiveElement(_elements[0]);
        }
    };

    function init() {
        parseOptions(options);
    }

    function parseOptions(options) {
        if (options) {
            _inputEventHandler.onInputEvent(options.multiKeysEventSelect, thiz.select);
        }
    }

    function setActiveElement(element) {
        _currentElement = element || _currentElement;
        _elements.removeClass("selected");
        //if ($(_currentElement)[0] && ($(_currentElement)[0].dataset.x === "0" || $(_currentElement)[0].dataset.x === "70") && $(_currentElement)[0].dataset.y === "0") {
        if ($(_currentElement)[0] && options.multiKeysEventSelect.get(stringifyPressedKeys()) === $(_currentElement)[0].dataset.customId) {
            $(_currentElement).addClass("selected");
            if (document.getElementsByClassName("grid")[0]) {
                actionService.doAction(document.getElementsByClassName("grid")[0].id, $(_currentElement)[0].dataset.id);
            }
        }
    }

    thiz.setSelectionListener = function (fn) {
        _selectionListener = fn;
    };
    
    function customKeyboardListener(event) {
        let keyCode = event.which || event.keyCode;
        if (keyCode) {
            _pressedKeys.add(keyCode)
            if (options.multiKeysEventSelect.has(stringifyPressedKeys())) {
                thiz.select()
            }
        }
    }

    function stringifyPressedKeys() {
        return Array.from(_pressedKeys).sort().join(":")
    }

    function customKeyUpListener(event) {
        if (event.repeat) {
            return;
        }
        let keyCode = event.which || event.keyCode;
        if (keyCode) {
            _pressedKeys.delete(keyCode)
        }
    }

    init();
}

export {CustomInput};