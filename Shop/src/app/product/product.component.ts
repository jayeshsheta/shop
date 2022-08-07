import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../cart.service';
import { Cart } from '../interfaces/Cart';
import { ShopService } from '../shop.service';

export interface Product {
  id: number;
  imageURL: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  color: string;
  gender: string;
  quantity: number;
  inCart?: boolean;
  inCartQty?: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnDestroy, OnInit {

  altImgUrl: string = 'https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/polo-tshirts.png';
  public subscriptions: Subscription[] = [];

  constructor(private cartService: CartService, private shopService: ShopService) {
  }


  @Input() product: Product;
  ngOnInit(): void {
    this.refreshData();
  }
  addToCart(item: Product) {
    if (!this.allowItemToAdd(item)) {
      alert('Maximum product limit reached or no item available to purchase.')
      return;
    }
    if (this.cartService.cartItems.findIndex(x => x.id === item.id) === -1) {
      const cartItem = item;
      cartItem.inCartQty = 1;
      cartItem.inCart = true;
      this.cartService.cartItems.push(cartItem);
    }
    else {
      this.cartService.cartItems.find(x => x.id === item.id).inCartQty = this.cartService.cartItems.find(x => x.id === item.id).inCartQty + 1;
    }
    this.cartService.CurrentCartItems.next(this.cartService.cartItems);
    this.cartService.setCartDataFromLocalStorage(this.cartService.cartItems);
    this.refreshData();
  }

  onDelete(item) {
    let inCartItems: Product[] = []
    this.cartService.CurrentCartItems.subscribe(res => {
      inCartItems = res;
    });
    if (inCartItems.findIndex(x => x.id === item.id) > -1) {
      inCartItems.splice(inCartItems.findIndex(x => x.id === item.id), 1)
    }
    this.cartService.CurrentCartItems.next(inCartItems);
    this.cartService.setCartDataFromLocalStorage(inCartItems);
    this.refreshData();

  }
  allowItemToAdd(item: Product) {
    let products: Product[] = [];
    let productsInCart = 0;
    let subr = this.cartService.CurrentCartItems.subscribe(res => {
      products = res;
    });

    if (products && products.findIndex(x => x.id === item.id) > -1) {
      productsInCart = products.find(x => x.id === item.id).inCartQty;
    }
    return productsInCart < item.quantity;
  }
  removeFromCart(item: Product) {
    debugger
    if (this.cartService.cartItems.find(x => x.id === item.id).inCartQty === 0) {
      this.onDelete(item);
      return;
    }
    let cartItems = this.cartService.getCartDataFromLocalStorage();
    cartItems.find(x => x.id === item.id).inCartQty = cartItems.find(x => x.id === item.id).inCartQty - 1;
    this.cartService.CurrentCartItems.next(cartItems);
    this.cartService.setCartDataFromLocalStorage(cartItems);

    this.refreshData();
   
  }
  refreshData() {
    let products: Product[] = [];
    this.shopService.initialProducts.subscribe(res => { products = res });
    let cartItems = this.cartService.getCartDataFromLocalStorage();
    if (cartItems)
      products.forEach(product => {
        if (cartItems.findIndex(item => item.id === product.id) != -1) {
          // product.inCart = true;
          product.inCartQty = cartItems.find(item => item.id === product.id).inCartQty;
          product.inCart = product.inCartQty > 0
        }
      });
    this.shopService.filteredProducts.next(products);
  }
  setAltImg() {
    this.altImgUrl = '/assets/images/default.png'
  }
  ngOnDestroy() {
    this.shopService.clearSubscriptions(this.subscriptions)
  }
}
