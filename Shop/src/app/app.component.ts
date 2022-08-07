import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private cartService: CartService) { }
  title = 'my-shop';
  ngOnInit() {
    this.cartService.CurrentCartItems.next(this.cartService.getCartDataFromLocalStorage())
  }
}
