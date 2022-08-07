import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  searchTerm: string = '';
  productCount: number = 0;
  searchTermChanged: Subject<string> = new Subject<string>();
  public subscriptions: Subscription[] = [];

  constructor(private shopService: ShopService) {
    this.shopService.filteredProducts.subscribe(res => {
      this.productCount = res.length;
    })
  }
  search(event: any) {
    if (this.searchTermChanged.observers.length === 0) {
      const searchSub = this.searchTermChanged.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(term => {
          this.shopService.searchWord.next(this.searchTerm);
          console.log(term);
        });
      this.subscriptions.push(searchSub);
    }
    this.searchTermChanged.next(event.target.value);
  }

  public ngOnDestroy(): void {
    this.shopService.clearSubscriptions(this.subscriptions);
  }
}
