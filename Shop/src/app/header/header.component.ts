import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartCount = 0;
  totalVal = 0;
  constructor(private cartService: CartService, private router: Router) {
    this.cartService.CurrentCartItems.subscribe(res => {
      if (res !== null && res.length > 0) {
        this.cartCount = res.reduce((initial, itemCount) => initial + itemCount.inCartQty, 0);
        this.totalVal = res.reduce((initial, itemCount) => initial + itemCount.inCartQty * itemCount.price, 0);
      }

    })
  }
  navigateToCart() {
    this.router.navigate(['/cart']);
  }

}
