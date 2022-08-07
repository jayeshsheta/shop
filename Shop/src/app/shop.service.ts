import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product } from './product/product.component';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(private http: HttpClient) { }
  public searchWord = new BehaviorSubject<string>("");
  public filteredProducts = new BehaviorSubject<Product[]>([]);
  public initialProducts = new BehaviorSubject<Product[]>([]);


  getProducts() {
    return this.http.get<Product[]>("https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json").pipe(map((res: Product[]) => { return res; }))
  }

  public clearSubscriptions(subscriptions: Subscription[]): void {
    if (subscriptions && subscriptions.length) {

      if (subscriptions.length === 1) {
        subscriptions[0].unsubscribe();

      } else if (subscriptions.length > 1) {
        for (const subscription of subscriptions) {
          subscription.unsubscribe();
        }
      }
    }
  }

}