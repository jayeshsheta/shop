import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from './interfaces/Cart'
import { Product } from './product/product.component';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  public cartItems: Product[] = [];
  public CurrentCartItems = new BehaviorSubject<Product[]>([]);

  getCartDataFromLocalStorage() {
    const cartData:Product[] = JSON.parse(localStorage.getItem('cartData'));
    return cartData;
  }
  setCartDataFromLocalStorage(cartData) {
    localStorage.setItem('cartData', JSON.stringify(cartData));
  }
}
