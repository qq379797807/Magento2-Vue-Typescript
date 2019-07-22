import { VueConstructor } from 'vue'

declare let window: any

const BREAKPOINTS: any = {
    mobile: 640,
    tablet: 768,
    tablet_landscape: 1024,
    desktop: 1200,
    desktop_large: 1440,
    hd: 1920,
}

const VueResize: any = {
    install: (Vue: VueConstructor, options?: any) => {
        const _breakpoints = options || BREAKPOINTS
        const $bus = Vue.prototype['$bus']

        window.addEventListener('resize', () => {
            $bus.$emit('$vueResize', window.innerWidth)
        })
        
        Vue.directive('resize', {
            bind (el, binding) {
                let removeChild = document.createComment(' ')
                if (!_breakpoints[binding.value]) {
                    throw new Error(`Missing breakpoint for ${binding.value}`)
                }
                $bus.$on('$vueResize', (value: any) => {
                    if (_breakpoints[binding.value] > value) {
                        if (el.parentNode) {
                            el.parentNode.replaceChild(removeChild, el)
                        }
                    } else {
                        if (removeChild.parentNode) {
                            removeChild.parentNode.replaceChild(el, removeChild)
                        }
                    }
                })
            },
            inserted () {
                window.dispatchEvent(new Event('resize'))
            }
        })
    }
}

export default VueResize