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
        const _breakpoints: any = options || BREAKPOINTS
        const $bus: any = Vue.prototype['$bus']

        window.addEventListener('resize', () => {
            $bus.$emit('$vueResize', window.innerWidth)
        })
        
        Vue.directive('resize', {
            bind (el, binding) {
                let removeChild: any = document.createComment(' ')
                let point: string = binding.value.point
                let visible: boolean = binding.value.visible

                if (!_breakpoints[point]) {
                    throw new Error(`Missing breakpoint for ${point}`)
                }
                
                $bus.$on('$vueResize', (value: any) => {
                    if (_breakpoints[point] > value) {
                        if (visible) {
                            if (el.parentNode) {
                                el.parentNode.replaceChild(removeChild, el)
                            }
                        } else {
                            if (removeChild.parentNode) {
                                removeChild.parentNode.replaceChild(el, removeChild)
                            }
                        }
                    } else {
                        if (visible) {
                            if (removeChild.parentNode) {
                                removeChild.parentNode.replaceChild(el, removeChild)
                            }
                        } else {
                            if (el.parentNode) {
                                el.parentNode.replaceChild(removeChild, el)
                            }
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