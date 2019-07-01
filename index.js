(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.OutsideClick = factory());
}(this, function () {
    'use strict';

    var outsideClick = {};
    outsideClick.install = function (Vue) {
        var handleOutsideClick;
        Vue.directive('outside-click', {
            bind(el, binding, vnode) {
                handleOutsideClick = e => {
                    e.stopPropagation()
                    const { handler, exclude } = binding.value
                    let clickedOnExcludedEl = false
                    exclude.forEach(refName => {
                        if (!clickedOnExcludedEl) {
                            const excludedEl = vnode.context.$refs[refName]
                            clickedOnExcludedEl = excludedEl.contains(e.target)
                        }
                    })
                    if (!el.contains(e.target) && !clickedOnExcludedEl) {
                        vnode.context[handler]()
                    }
                }
                document.addEventListener('click', handleOutsideClick)
                document.addEventListener('touchstart', handleOutsideClick)
            },
            unbind() {
                document.removeEventListener('click', handleOutsideClick)
                document.removeEventListener(
                    'touchstart',
                    handleOutsideClick
                )
            }
        });
    };

    if (typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(outsideClick);
    }

    return outsideClick;

}));
