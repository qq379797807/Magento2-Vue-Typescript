import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import { mapActions } from 'vuex'
import { VPrice } from './price'

@Component({
    name: 'v-product-item',
    data: () => ({
        i18n: {
            closeout: 'Closeout',
            special: 'Specials',
            newItem: 'New Item',
            sku: 'Item',
            price: 'Price',
            sold: '*Sold in Lots of',
            quantity: 'Piece Quantity*',
            minimum: 'Piece Minimum',
            pieces: 'Pieces',
            orderCase: 'Order By Case',
            unit: 'pieces x',
            addToCart: 'Add To Cart',
            outOfStock: 'Out Of Stock',
            logIn: 'Log in',
            only: 'Now Only',
            each: 'Each',
            toNotify: 'to get notified when this product comes back in stock'
        }
    }),
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: {
        VPrice
    },
    methods: {
        ...mapActions([
            'showProductModal'
        ])
    }
})
export class VProductItem extends Vue {
    public qty: number = 1
    public type: string = 'piece'
    public loginUrl: string = ''
    public totalPrice: number = 0
    public selectQty: number = 1
    public unitPrice: number = 0

    mounted () {
        this.init()
    }

    init () {
        const commonJson: any = window.commonJson
        this.loginUrl = commonJson.login_url
        this.createUnitPrice()
        this.changeType()
    }

    showModal (e: Event, sku: string) {
        if (e.stopPropagation) e.stopPropagation
        this.showProductModal(sku)
    }

    createUnitPrice () {
        if (this.item.deal_info && this.item.deal_info.datetime_to) {
            this.unitPrice = this.item.deal_info.deal_price
        } else if (this.item.special_price) {
            this.unitPrice = this.item.deal_info.special_price
        } else {
            this.unitPrice = this.item.price.regularPrice.amount.value
        }
    }

    changeType () {
        this.qty = this.type === 'piece' ? this.item.item_info.input_qty : 1
        this.selectQty = this.type === 'piece' ? this.item.item_info.input_qty : this.item.item_info.case_qty
        this.updatePrice()
    }

    changePrice () {
        if (this.type === 'piece') {
            this.selectQty = this.qty
        } else {
            this.selectQty = this.item.item_info.case_qty * this.qty
        }

        this.updatePrice()
    }

    updatePrice () {
        this.totalPrice = this.selectQty * this.unitPrice
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="product-item-info">
                {this.item.deal_info && this.item.deal_info.datetime_to ? (
                    <v-countdown end={this.item.deal_info.datetime_to}></v-countdown>
                ) : (
                    <v-fragment>
                        {this.item.special_value.closeout ? (
                            <p class="in-closeout">{this.i18n.closeout}</p>
                        ) : null}
                        {this.item.special_price ? (
                            <p class="in-special">{this.i18n.special}</p>
                        ) : null}
                        {this.item.special_value.new_item ? (
                            <p class={this.item.special_price ? 'in-new second' : 'in-new'}>{this.i18n.newItem}</p>
                        ) : null}
                    </v-fragment>
                )}
                
                <a href="javascript:;" class="product-item-photo" tabindex="-1" title={this.item.name} onClick={(e: Event) => this.showModal(e, this.item.sku)}>
                    <img v-lazy={this.item.image.url} class="product-image-photo" width="240" height="300" />
                    {this.item.stock_status === 'OUT_OF_STOCK' ? (
                        <i class="in-stock"></i>
                    ) : null}
                </a>
                <div class="product-item-details" onClick={(e: Event) => this.showModal(e, this.item.sku)}>
                    <strong class="product-item-name">
                        <a href="javascript:;" class="product-item-link" title={this.item.name}>{this.item.name}</a>
                    </strong>
                    <p class="product-item-sku">
                        <span>{this.i18n.sku}&nbsp;#&nbsp;</span>
                        <span>{this.item.sku}</span>
                    </p>
                    <p class="product-item-price">
                        <span>{this.i18n.price}:&nbsp;</span>
                        <v-price className={this.item.special_price ? 'old-price' : 'regular-price'} price={this.item.price.regularPrice.amount.value}></v-price>
                        {this.item.deal_info && this.item.deal_info.datetime_to ? (
                            <v-price className="deal-price" price={this.item.deal_info.deal_price}></v-price>
                        ) : (
                            <v-fragment>
                                {this.item.special_price ? (
                                    <v-price className="special-price" price={this.item.special_price}></v-price>
                                ) : null}
                            </v-fragment>
                        )}
                    </p>
                </div>
                <div class="product-item-box">
                    <i class="v-icon vcon-arrow"></i>
                    {this.item.stock_status === 'OUT_OF_STOCK' ? (
                         <div class="in-content">
                            <div class="in-group">
                                <v-button type="orange" native="button">{this.i18n.outOfStock}</v-button>
                            </div>
                            <p class="msg">
                                <a href={this.loginUrl}>{this.i18n.logIn}</a> 
                                <span>{this.i18n.toNotify}</span>
                            </p>
                         </div>
                    ) : (
                        <div class="in-content">
                            <div class="in-group">
                                <v-button type="green" native="button">{this.i18n.addToCart}</v-button>
                            </div>
                            <div class="in-box">
                                {this.item.item_info.qty_increment ? (
                                    <span class="sold">{`${this.i18n.sold} ${this.item.item_info.qty_increment}`}</span>
                                ) : null}
                                <ul class="list">
                                    <li class={this.type === 'piece' && 'active'}>
                                        <v-radio name={`type_${this.item.id}`} vModel={this.type} checked="piece" change={this.changeType}></v-radio>
                                        <p class="in-type">
                                            <label>{this.i18n.quantity}</label>
                                            <span>({this.item.item_info.inner_qty} {this.i18n.minimum})</span>
                                        </p>
                                        {this.type === 'piece' ? (
                                            <v-qplus name={`qty_${this.item.id}`} vModel={this.qty} step={this.item.item_info.qty_increment} change={this.changePrice}></v-qplus>
                                        ) : null}
                                    </li>
                                    {this.item.item_info.is_saleable ? (
                                        <li class={this.type === 'case' && 'active'}>
                                            <v-radio name={`type_${this.item.id}`} vModel={this.type} checked="case" change={this.changeType}></v-radio>
                                            <p class="in-type">
                                                <label>{this.i18n.orderCase}</label>
                                                <span>({this.item.item_info.case_qty} {this.i18n.pieces})</span>
                                            </p>
                                            {this.type === 'case' ? (
                                                <v-qplus name={`qty_${this.item.id}`} vModel={this.qty} step={1} change={this.changePrice}></v-qplus>
                                            ) : null}
                                        </li>
                                    ) : null}
                                </ul>
                                <div class="in-total">
                                    <span>{`${this.selectQty} ${this.i18n.unit}`}</span>&nbsp; 
                                    <v-price className="price" price={this.unitPrice}></v-price>&nbsp;
                                    <span>=</span>&nbsp;
                                    <v-price className={this.item.deal_info && this.item.deal_info.datetime_to ? 'deal-total' : 'total'} price={this.totalPrice}></v-price>
                                </div>
                                {this.item.deal_info && this.item.deal_info.datetime_to ? (
                                    <p class="product-item-deal">
                                        <span>{this.i18n.only}</span>
                                        <v-price className="price" price={this.item.deal_info.deal_price}></v-price>
                                        <span>{this.i18n.each}</span>
                                    </p>
                                ) : null }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}