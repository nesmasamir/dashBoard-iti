import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { category } from 'src/app/models/Icategory';
import { Iproduct } from 'src/app/models/Iproduct';
import { CategoryService } from 'src/app/services/category.service';
import { ProductsService } from 'src/app/services/products.service';
import { SharedDataService } from 'src/app/services/shared-data.service';


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit, AfterViewInit, OnChanges {

  displayImage: any;
  categriesList: category[] = [];
  productList: Iproduct[] = [];
  @Input() switchAction!: boolean
  @Output() changeToggle = new EventEmitter();
  @Input() productObject: Iproduct = {
    id: "",
    name: "",
    description: "",
    price: 0,
    rating: 4,
    image: "",
    countInStock: 0,
    category: {
      _id: "",
      name: ""
    },
    isFeatured: false
  };
  productForm: any | UntypedFormGroup;
  constructor(formbuilder: UntypedFormBuilder, private catService: CategoryService, private productService: ProductsService, private sharedData: SharedDataService) {
    this.productForm = formbuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      countInStock: ['', [Validators.required]],
      description: ['', [Validators.required]],
      isFeatured: ['', [Validators.required]],
      image: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.productList = products;
    });
    this.catService.getAllCategories().subscribe(categories => {
      this.categriesList = categories;
    })
    console.log("oninit")

  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // to determine which button clicked add or edite
    if (!this.switchAction) {
      this.displayProductInfo();
    }
    console.log("onchanges")
  }

  get proName() {
    return this.productForm.get("name")
  }
  get catName() {
    return this.productForm.get("category")
  }
  get price() {
    return this.productForm.get("price")
  }
  get stock() {
    return this.productForm.get("countInStock")
  }
  get desc() {
    return this.productForm.get("description")
  }
  get img() {
    return this.productForm.get("image")
  }
  get isFeatured() {
    return this.productForm.get("isFeatured")
  }

  getCategoryById(catId: string) {
    let category = this.categriesList.find(cat => {
      return cat._id === catId;
    })
    return category
  }

  closeModal(productModal: any) {
    productModal.style.display = "none";
    this.changeToggle.emit(false);
  }

  //to display product info in form to update it
  displayProductInfo() {
    console.log(this.productObject)
    this.productForm.patchValue({
      name: this.productObject?.name,
      category: this.productObject?.category?._id,
      price: this.productObject?.price,
      countInStock: this.productObject?.countInStock,
      description: this.productObject?.description,
      isFeatured: this.productObject!.isFeatured,
      image: this.productObject!.image
    })

    console.log(this.productObject)
  }


  //to update product
  updateProduct(modal: any) {
    const formData = new FormData();
    Object.keys(this.productForm.controls).map((key) => {
      formData.append(key, this.productForm.controls[key].value);
      console.log(this.productForm.controls[key].value)
    });


    this.productService.updateProduct(this.productObject.id!, formData).subscribe(res => {
      console.log(res)
      console.log(modal)
      this.closeModal(modal)
      setTimeout(() => {
        this.sharedData.toggleSuccessModal(true)
      }, 500)
      setTimeout(() => {
        this.sharedData.toggleSuccessModal(false)
      }, 2000)

    })

  }

  //add new product 
  submit(modal: any) {
    const formData = new FormData();
    Object.keys(this.productForm.controls).map((key) => {
      formData.append(key, this.productForm.controls[key].value);
      console.log(this.productForm.controls[key].value)
    });
    this.productService.addProduct(formData).subscribe(pro => {

      this.closeModal(modal)
      setTimeout(() => {
        this.sharedData.toggleSuccessModal(true)
      }, 500)
      setTimeout(() => {
        this.sharedData.toggleSuccessModal(false)
      }, 2000)

    })

  }


  uploadFile(event: any) {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')!.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.displayImage = fileReader.result
      }
      fileReader.readAsDataURL(file)

    }
  }


}



















