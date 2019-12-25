import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import { mapState, mapMutations } from 'vuex'
import { VPrice } from './price'
import { VDescription } from './description'
import { VProps } from './props'

@Component({
    name: 'v-category-modal',
    data: () => ({
        i18n: {
            closeout: 'Closeout',
            special: 'Specials',
            newItem: 'New Item',
            sku: 'Item',
            price: 'Price',
            sold: '*Sold in Lots of',
            quantity: 'Order By Piece*',
            minimum: 'Piece Minimum',
            pieces: 'Pieces',
            orderCase: 'Order By Case',
            unit: 'pieces x',
            pieceUnit: 'pcs',
            caceUnit: 'css',
            addToCart: 'Add To Cart',
            outOfStock: 'Out Of Stock',
            logIn: 'Log in',
            email: 'Email Address',
            submit: 'Submit',
            description: 'Description',
            specifications: 'Specifications',
            toNotify: 'to get notified when this product comes back in stock',
            notify: '*Notify Me If This Item Drops In Price'
        }
    }),
    components: {
        VPrice,
        VDescription,
        VProps
    },
    computed: {
        ...mapState([
            'modalVisible',
            'productItem'
        ])
    },
    methods: {
        ...mapMutations([
            'closeModal'
        ])
    }
})
export class VCategoryModal extends Vue {
    public modalW: number = 1200
    public classes: string = 'in-product-modal'
    public lockScroll: boolean = false
    public email: string = ''
    public inputQty: number = 1
    public inputType: string = 'piece'
    public totalPrice: number = 0
    public selectQty: number = 1 

    beforeClose () {
        this.closeModal()
    }

    notify () {
        console.log(`notify me...`)
    }

    changeType () {
        this.qty = this.type === 'piece' ? this.productItem.item_info.input_qty : 1
        this.selectQty = this.type === 'piece' ? this.productItem.item_info.input_qty : this.productItem.item_info.case_qty
        this.updatePrice()
    }

    changePrice () {
        if (this.type === 'piece') {
            this.selectQty = this.qty
        } else {
            this.selectQty = this.productItem.item_info.case_qty * this.qty
        }

        this.updatePrice()
    }

    updatePrice () {
        this.totalPrice = this.selectQty * (this.productItem.special_price ? this.productItem.special_price : this.productItem.price.regularPrice.amount.value)
    }

    render (h: CreateElement): JSX.Element {
        const commonJson: any = window.commonJson
        const origin: string = window.location.origin
        const product: any = this.productItem
        const media_path: string = `${commonJson.media_path}catalog/product`

        return (
            <div class="in-product-modal">
                <v-modal classes={this.classes} visible={this.modalVisible} width={this.modalW} lockScroll={this.lockScroll} beforeClose={this.beforeClose}>
                    {this.modalVisible ? (
                        <div class="in-wrapper">
                            <div class="in-gallery">
                                {product.media_gallery_entries.length > 0 ? (
                                    <div class="in-media">
                                        {product.special_value.closeout ? (
                                            <p class="in-closeout">{this.i18n.closeout}</p>
                                        ) : null}
                                        {product.special_price ? (
                                            <p class="in-special">{this.i18n.special}</p>
                                        ) : null}
                                        {product.special_value.new_item ? (
                                            <p class={product.special_price ? 'in-new second' : 'in-new'}>{this.i18n.newItem}</p>
                                        ) : null}
                                        {product.deal_info && product.deal_info.deal_price ? (
                                            <v-countdown end={product.deal_info.datetime_to}></v-countdown>
                                        ) : null}
                                        <v-swiper directionNav={false} autoPlay={false}>
                                            {product.media_gallery_entries.map((item: any) => {
                                                return (
                                                    <v-swiper-item>
                                                        <img src={`${media_path}${item.file}`} alt={product.name} />
                                                    </v-swiper-item>
                                                )
                                            })}
                                        </v-swiper>
                                    </div>
                                ) : null}
                                {product.media_gallery_entries.length > 0 ? (
                                     <div class="in-thumb">
                                        <carousel per-page={5} centerMode={false} mouse-drag={true}>
                                            {product.media_gallery_entries.map((item: any) => {
                                                    return (
                                                        <slide>
                                                            <img src={`${media_path}${item.file}`} alt={product.name} />
                                                        </slide>
                                                    )
                                                })
                                            }
                                        </carousel>
                                    </div>
                                ) : null}
                                <div class="in-notify">
                                    <p>{this.i18n.notify}</p>
                                    <v-form method="post">
                                        <v-form-item classes={'in-flex'}>
                                            <v-input type="email" name="email" vModel={this.email} rules="required|email" placeholder={this.i18n.email}></v-input>
                                            <v-button type="primary" native="button" onClick={this.notify}>{this.i18n.submit}</v-button>
                                        </v-form-item>
                                    </v-form>
                                </div>
                            </div>
                            <div class="in-details">
                                <p class="in-price">
                                    <span>{this.i18n.price}:&nbsp;</span>
                                    <v-price className={product.special_price ? 'old-price' : 'regular-price'} price={product.price.regularPrice.amount.value}></v-price>
                                    {product.special_price ? (
                                        <v-price className="special-price" price={product.special_price}></v-price>
                                    ) : null}
                                    {product.item_info.qty_increment ? (
                                        <span class="sold">{`${this.i18n.sold} ${product.item_info.qty_increment}`}</span>
                                    ) : null}
                                </p>
                                <div class="in-box">
                                    <ul class="list">
                                        <li class={this.inputType === 'piece' && 'active'}>
                                            <v-radio name={`type_${product.id}`} vModel={this.inputType} checked="piece" change={this.changeType}></v-radio>
                                            <p class="in-type">
                                                <label>{this.i18n.quantity}</label>
                                                <span>{product.item_info.inner_qty} {this.i18n.minimum}</span>
                                            </p>
                                            <div class="in-qty">
                                                <v-qplus name={`qty_${product.id}`} vModel={this.inputQty} step={product.item_info.qty_increment} change={this.changePrice}>
                                                    <span class="unit">{this.i18n.pieceUnit}</span>
                                                </v-qplus>
                                                <p class="layer"></p>
                                            </div>
                                        </li>
                                        {product.item_info.is_saleable ? (
                                            <li class={this.inputType === 'case' && 'active'}>
                                                <v-radio name={`type_${product.id}`} vModel={this.inputType} checked="case" change={this.changeType}></v-radio>
                                                <p class="in-type">
                                                    <label>{this.i18n.orderCase}</label>
                                                    <span>({product.item_info.case_qty} {this.i18n.pieces})</span>
                                                </p>
                                                <div class="in-qty">
                                                    <v-qplus name={`qty_${product.id}`} vModel={this.inputQty} step={1} change={this.changePrice}>
                                                        <span class="unit">{this.i18n.caceUnit}</span>
                                                    </v-qplus>
                                                    <div class="layer"></div>
                                                </div>
                                            </li>
                                        ) : null}
                                    </ul>
                                    <div class="in-total">
                                        <div class="content">
                                            <span>{`${this.inputQty} ${this.i18n.unit}`}</span>&nbsp; 
                                            <v-price className="price" price={product.special_price ? product.special_price : product.price.regularPrice.amount.value}></v-price>&nbsp;
                                            <span>=</span>&nbsp;
                                            <v-price className="total" price={this.totalPrice}></v-price>
                                            <v-button type="green" native="button">{this.i18n.addToCart}</v-button>
                                        </div>
                                    </div>
                                </div>
                                <h1 class="in-name">
                                    <a href={product.url_key} title={product.name}>{product.name}</a>
                                </h1>
                                <p class="in-sku">
                                    <span>{this.i18n.sku}&nbsp;#&nbsp;</span>
                                    <span>{product.sku}</span>
                                </p>
                                <p class="in-url">{`${origin}/${product.url_key}`}</p>
                                {product.description.html ? (
                                    <div class="in-description">
                                        <h1>{this.i18n.description}</h1>
                                        <v-description description={product.description.html}></v-description>
                                    </div>
                                ) : null}
                                {product.item_info.specifications ? (
                                    <div class="in-specification">
                                        <h1>{this.i18n.specifications}</h1>
                                        <div class="in-submenu">
                                            {product.item_info.specifications.map((item: any) => {
                                                return (
                                                    <ul>
                                                        {item.specifications_info.map((info: any) => {
                                                            if (info.value !== null) {
                                                                return (
                                                                    <li>
                                                                        <strong>{info.title}</strong>
                                                                        {info.url ? (
                                                                            <a href={info.url} title={info.value}>{info.value}</a>
                                                                        ) : (
                                                                            <span>{info.value}</span>
                                                                        )}
                                                                    </li>
                                                                )
                                                            }
                                                        })}
                                                    </ul>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                                {product.item_info.prop_65[0].is_enable ? (
                                    <div class="in-pros">
                                        <v-collapse>
                                            <v-collapse-panel name="pros">
                                                <h4>{product.item_info.prop_65[0].title}</h4>
                                                <div class="content" slot="content">
                                                    <img v-lazy={product.item_info.prop_65[0].icon_url} alt={product.item_info.prop_65[0].title} />
                                                    <v-props data={product.item_info.prop_65[0].content}></v-props>
                                                </div>
                                            </v-collapse-panel>
                                        </v-collapse>
                                    </div>
                                ) : null }
                            </div>
                        </div>
                    ) : null}
                </v-modal>
            </div>
        )
    }
}