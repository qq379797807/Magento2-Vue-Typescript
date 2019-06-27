import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

declare let document: any

@Component({
    name: 'v-product-zoomer',
    props: {
        baseImages: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        },
        baseZoomerOptions: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    watch: {
        choosedThumb: function (thumb) {
            let matchNormalImg = this.normal_size.find((img: any) => {
              return img.id === thumb.id
            })
            let matchLargeImg = this.large_size.find((img: any) => {
              return img.id === thumb.id
            })
            this.previewLargeImg = Object.assign({}, matchLargeImg)
            this.previewImg = Object.assign({}, matchNormalImg)
            if (this.drift !== null) {
              this.drift.setZoomImageURL(matchLargeImg.url)
            }
        }
    }
})
export class VProductZoomer extends Vue {
    public previewImg: any = {}
    public previewLargeImg: any = {}
    public thumbs: any[] = []
    public normal_size: any[] = []
    public large_size: any[] = []
    public choosedThumb: any = {}
    public drift: any = null
    public options: any =  {
        zoomFactor: 4,
        pane: 'container',
        hoverDelay: 300,
        namespace: 'container-zoomer',
        move_by_click: true,
        scroll_items: 4,
        choosed_thumb_border_color: '#ff3d00',
        move_button_style: 'chevron'
    }

    public created () {
        this.createView()
    }

    public mounted () {
        this.init()
    }

    public init () {
        document.querySelector(`.${this.zoomer_box} .thumb-list`)
            .setAttribute('style', `grid-template-columns: repeat(${this.baseZoomerOptions.scroll_items}, auto)`)

        let t = setInterval(() => {
            if (document.readyState === 'complete') {
                if (this.options.pane === 'container-round') {
                    this.options.inlinePane = true
                } else {
                    this.options.inlinePane = false
                    this.options.paneContainer = document.getElementById(this.pane_id)
                    let rect: any = document.querySelector(`.${this.zoomer_box}`)
                    let customStyle = ''

                    if (this.options.pane === 'pane') {
                        customStyle =
                            'width:' + rect.getBoundingClientRect().width * 1.2 + 'px;'
                            'height:' + rect.getBoundingClientRect().height + 'px;'
                            'left:' + (rect.getBoundingClientRect().right + window.scrollX + 5) + 'px;'
                            'top:' + (rect.getBoundingClientRect().top + window.scrollY) + "px;"
                    } else {
                        customStyle =
                            'width:' + rect.getBoundingClientRect().width + 'px;'
                            'height:' + (rect.getBoundingClientRect().height + 2) + 'px;'
                            'left:' + (rect.getBoundingClientRect().x + window.scrollX) + 'px;'
                            'top:' + (rect.getBoundingClientRect().top + window.scrollY) + 'px;'
                    }

                    this.options.paneContainer.setAttribute('style', customStyle)
                }

                this.options.injectBaseStyles = true
                let previewImg: string = `.${this.zoomer_box}> div > img`
                // this.drift = new Drift(document.querySelector(previewImg), this.options)
                clearInterval(t)
            }
        }, 500)
    }

    public createView () {
        if (Object.keys(this.baseImages).length > 0) {
            for (const key in this.baseImages) {
                if (this.baseImages.hasOwnProperty(key)) {
                    this[key] = this.baseImages[key]
                }
            }
        }

        if (this.normal_size.length == 0) {
            console.warn(`Product Zoomer Need Normal Size Image At Least!`)
        }

        if (this.thumbs.length == 0) {
            this.thumbs = Object.assign([], this.normal_size)
        } else {
            this.choosedThumb = this.thumbs[0]
        }

        if (this.large_size.length == 0) {
            this.large_size = Object.assign([], this.normal_size)
        }

        if (Object.keys(this.baseZoomerOptions).length > 0) {
            for (const key in this.baseZoomerOptions) {
                if (this.baseZoomerOptions.hasOwnProperty(key)) {
                    const element = this.baseZoomerOptions[key]
                    this.options[key] = element
                }
            }
        }

        if (this.options.pane === 'container-round' || this.options.pane === 'container') {
            this.options.hoverBoundingBox = false
        } else {
            this.options.hoverBoundingBox = true
        }
    }

    public get zoomer_box () {
        return this.options.namespace + '-zoomer-box'
    }

    public get pane_id () {
        return this.options.namespace + '-pane-container'
    }

    public get move_button () {
        return this.options.move_button_style === 'chevron' 
            ? { left: 'chevron-left', right: 'chevron-right' } 
            : { left: 'angle-double-left', right: 'angle-double-right' }
    }

    public moveThumbs (direction: string) {
        let len: number = this.thumbs.length
        if (direction === 'right') {
          const moveThumb = this.thumbs.splice(len - 1, 1)
          this.thumbs = [moveThumb[0], ...this.thumbs]
        } else {
          const moveThumb = this.thumbs.splice(0, 1)
          this.thumbs = [...this.thumbs, moveThumb[0]]
        }
    }

    public chooseThumb (thumb: string, event: any) {
        let eventType: any = event.type
        if (eventType === 'mouseover') {
            if (!this.options.move_by_click) {
                this.choosedThumb = thumb
            }
        } else {
            this.choosedThumb = thumb
        }
    }
    
    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-gallery">
                <div class={ this.zoomer_box }>
                    <div class="preview-box">
                        <img
                            src={this.previewImg.url}
                            data-zoom={this.previewLargeImg.url}
                            class="responsive-image"
                            draggable="false"
                        />
                    </div>
                    <div class="zoomer-control-box">
                        <div onClick={() => this.moveThumbs('left')} class="zoomer-control">
                            <slot name="left">
                                <i class={this.move_button.left}></i>
                            </slot>
                        </div>
                        <div class="thumb-list">
                            {this.thumbs.map((thumb: any, key: number) => {
                                return (
                                    <img
                                        src={thumb.url}
                                        class={{'responsive-image': true, 'choosed-thumb': thumb.id === this.choosedThumb.id}}
                                        style={{'boxShadow' : thumb.id === this.choosedThumb.id ? '0px 0px 0px 2px ' + this.options.choosed_thumb_border_color : ''}}
                                        onClick={(e: any) => this.chooseThumb(thumb, e)}
                                        onMouseover={(e: any) => this.chooseThumb(thumb, e)}
                                        v-show={key < this.options.scroll_items}
                                        draggable="false"
                                    />
                                )
                            })}
                        </div>
                        <div onClick={() => this.moveThumbs('right')} class="zoomer-control">
                            <slot name="right">
                                <i class={this.move_button.right}></i>
                            </slot>
                        </div>
                    </div>
                    <div id={this.pane_id} class="pane-container"></div>
                </div>
            </div>
        )
    }
}