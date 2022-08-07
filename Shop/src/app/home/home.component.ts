import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product/product.component';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private shopService: ShopService) {
  }

  public productList: Product[] = [];
  public filttredProductList: Product[] = [];
  public subscriptions: Subscription[] = [];


  ngOnInit() {
    const productSub = this.shopService.getProducts()
      .subscribe(res => {
        this.productList = res;
        this.filttredProductList = [...this.productList];
        this.shopService.initialProducts.next(this.productList);
        this.shopService.filteredProducts.next(this.filttredProductList);
      });
    this.subscriptions.push(productSub);
  }

  filterProducts(term) {
    let productList: Product[] = [...this.productList];
    if (!productList[0]) return;
    const keys = ['name', 'type', 'price', 'color', 'gender'];//Object.keys(productList[0]);
    productList.forEach(element => {
      keys.forEach(key => {
        if (element[key].toString().toLowerCase().includes(term.toString().toLocaleLowerCase())) {
          if (this.filttredProductList && !this.filttredProductList.some(el => el.id === element.id))
            this.filttredProductList.push(element);
        }
      });
    });
    this.shopService.filteredProducts.next(this.filttredProductList);
    return this.filttredProductList;
  }
  public ngOnDestroy(): void {
    this.shopService.clearSubscriptions(this.subscriptions);
  }


}
