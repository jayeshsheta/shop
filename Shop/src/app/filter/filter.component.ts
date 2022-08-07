import { Component, OnInit } from '@angular/core';
import { Filters } from '../interfaces/Filter';
import { Product } from '../product/product.component';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {

  constructor(private shopService: ShopService) { }
  filters: Filters[] = [
    { id: 1, options: ['Red', 'Blue', 'Green'], label: 'Color', values: [false, false, false] },
    { id: 2, options: ['Men', 'Women'], label: 'Gender', values: [false, false] },
    { id: 3, options: ['0-Rs250', 'Rs251-450', 'Rs450'], label: 'Price', values: [false, false, false] },
    { id: 4, options: ['Polo', 'Hoodie', 'Basic'], label: 'Type', values: [false, false, false] },
  ];
  filter = {
    color: [],
    gender: [],
    type: [],
    price: []
  };
  // filttredProductList = [];
  ngOnInit() {
    const filterSub = this.shopService.searchWord.subscribe(res => {
      if (res === '') {
        let init = []
        this.shopService.initialProducts.subscribe(res => { init = res });
        // this.shopService.filteredProducts.next(this.filttredProductList);
        const query = this.buildFilter(this.filter);
        const result = this.filterDataByTag(init, query);
        this.shopService.filteredProducts.next(result);
        return;
      }
      this.filterProducts(res);
    })
  }
  filterProducts(term) {
    let productList: Product[];
    const combinedResult = [];
    this.shopService.filteredProducts.subscribe(res => { productList = res });
    if (!productList[0]) return;
    const keys = ['name', 'type', 'price', 'color', 'gender'];//Object.keys(productList[0]);
    productList.forEach(element => {
      keys.forEach(key => {
        if (element[key].toString().toLowerCase().includes(term.toString().toLocaleLowerCase())) {
          if (productList && !productList.some(el => el.id === element.id))
            productList.push(element);
            combinedResult.push(element)
        }
      });
    });
    this.shopService.filteredProducts.next(combinedResult);
    return combinedResult;
  }

  onFilter(event, label) {
    if (event.target.checked) {
      this.filter[label.toLowerCase()].push(event.target.id);
    }
    else {
      const index = this.filter[label.toLowerCase()].indexOf(event.target.id);
      if (index > -1) {
        this.filter[label.toLowerCase()].splice(index, 1);
      }
    }
    console.log(this.filter);
    let product: Product[];
    this.shopService.initialProducts.subscribe((res: Product[]) => {
      product = res
    });
    const query = this.buildFilter(this.filter);
    const result = this.filterDataByTag(product, query);
    this.shopService.filteredProducts.next(result);
    console.log(result);
  }

  buildFilter = (filter) => {
    let query = {};
    for (let keys in filter) {
      if (filter[keys].constructor === Array && filter[keys].length > 0) {
        query[keys] = filter[keys];
      }
    }
    return query;
  }

  priceHelper = {
    '0-Rs250': [0, 250],
    'Rs251-450': [251, 450],
    'Rs450': [450, 1000],
  };

  filterDataByTag = (data, query) => {
    const filteredData = data.filter((item) => {
      for (let key in query) {

        let paraLen = query[key].length;
        let p1 = query[key][0];
        let p2 = query[key][1];
        let p3 = query[key][2];

        if (key === 'price') {
          if (paraLen === 1 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][1])) {
            return false;
          }
          else if (paraLen === 2 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][1]) && !(item[key] >= this.priceHelper[p2][0] && item[key] <= this.priceHelper[p2][1])) {
            return false;
          }
          else if (paraLen === 3 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][0]) && (item[key] >= this.priceHelper[p2][0] && item[key] <= this.priceHelper[p2][0]) && (item[key] >= this.priceHelper[p3][0] && item[key] <= this.priceHelper[p3][0])) {
            return false;
          }
        }

        if (key !== 'price')
          if (item[key] === undefined || !query[key].includes(item[key])) {
            return false;
          }
      }
      return true;
    });
    return filteredData;
  };
}
