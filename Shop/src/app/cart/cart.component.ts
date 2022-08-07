import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Cart } from '../interfaces/Cart';
import { Product } from '../product/product.component';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private cartService: CartService,private shopService:ShopService) { }
  cartItems: Product[];
  ngOnInit() {
    this.cartService.CurrentCartItems.subscribe(res => {
      this.cartItems = res;
    });
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

  }

  onQtyChange(item) {
    let cartItems = this.cartService.getCartDataFromLocalStorage();
    cartItems.find(x => x.id === item.id).inCartQty = Number(item.inCartQty);
    this.cartService.CurrentCartItems.next(cartItems);
    this.cartService.setCartDataFromLocalStorage(cartItems);

    let products: Product[] = [];
    this.shopService.initialProducts.subscribe(res => { products = res });
    let Items = this.cartService.getCartDataFromLocalStorage();
    if (Items)
      products.forEach(product => {
        if (Items.findIndex(item => item.id === product.id) != -1) {
          product.inCartQty = cartItems.find(item => item.id === product.id).inCartQty;
          product.inCart = product.inCartQty > 0
        }
      });
  }

}
