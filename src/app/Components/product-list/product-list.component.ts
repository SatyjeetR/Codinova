import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Product } from 'src/app/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [];
  cartItems: any[] = [];
  selectedProduct: any = null;
  subTotal: number = 0;
  vat: number = 10;
  discount: number = 5;
  hoveredProduct: any = null;
  totalItems: number = 0;
  showPopup: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('assets/products.json').subscribe((data) => {
      this.products = data.DataList;
    });
  }

  addToCart(product: any) {
    if (!this.showPopup) {
      let cartItem = this.cartItems.find(item => item.id === product.id);
      if (cartItem) {
        cartItem.quantity++;
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
      this.updateValues();
    }
  }

  closePopup() {
    this.showPopup = false;
    this.cancelSale();
  }

  deleteItem(item: any) {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.updateValues();
    }
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.updateValues();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateValues();
    }
  }

  updateValues() {
    this.subTotal = this.calculateSubTotal();
    this.calculateTotal(); // Recalculate the total
  }
  
  calculateSubTotal(): number {
    let total = 0;
    this.totalItems = 0;
    this.cartItems.forEach(item => {
      total += item.price * item.quantity;
      this.totalItems += item.quantity;
    });
    return total;
  }

  calculateItemTotal(item: any): number {
    return item.price * item.quantity;
  }

  calculateTotal(): void {
    const vatAmount = (this.vat / 100) * this.subTotal;
    const discountAmount = (this.discount / 100) * this.subTotal;
    const total = this.subTotal + vatAmount - discountAmount;
    console.log('VAT Amount:', vatAmount);
    console.log('Discount Amount:', discountAmount);
    console.log('Total:', total);
  }
  
  cancelSale() {
    this.cartItems = [];
    this.subTotal = 0;
    this.vat = 10;
    this.discount = 5;
  }

  processSale() {
    this.showPopup = true;
  }

  showProductInfo(product: any) {
    this.hoveredProduct = product;
  }

  hideProductInfo() {
    this.hoveredProduct = null;
  }
}
