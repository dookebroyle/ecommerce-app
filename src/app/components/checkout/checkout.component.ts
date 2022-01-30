import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CartService } from 'src/app/services/cart.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number= 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingStates: State[] = [];
  billingStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private ShopFormService: ShopFormService,
              private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                              [Validators.required,
                               Validators.minLength(2),
                               ShopValidators.notOnlyWhitespace]),

        lastName:  new FormControl('',
                              [Validators.required,
                               Validators.minLength(2),
                               ShopValidators.notOnlyWhitespace]),

        email: new FormControl('',
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shipping: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                     ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                                   ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                      ShopValidators.notOnlyWhitespace])
      }),
      billing: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                     ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                                   ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                      ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2),
                                          ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
      })
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries

    this.ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingStreet() { return this.checkoutFormGroup.get('shipping.street'); }
  get shippingCity() { return this.checkoutFormGroup.get('shipping.city'); }
  get shippingState() { return this.checkoutFormGroup.get('shipping.state'); }
  get shippingZipCode() { return this.checkoutFormGroup.get('shipping.zipCode'); }
  get shippingCountry() { return this.checkoutFormGroup.get('shipping.country'); }

  get billingStreet() { return this.checkoutFormGroup.get('billing.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billing.city'); }
  get billingState() { return this.checkoutFormGroup.get('billing.state'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billing.zipCode'); }
  get billingCountry() { return this.checkoutFormGroup.get('billing.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }



  copyShippingToBilling(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billing']
            .setValue(this.checkoutFormGroup.controls['shipping'].value);

      // bug fix for states
      this.billingStates = this.shippingStates;

    }
    else {
      this.checkoutFormGroup.controls['billing'].reset();

      // bug fix for states
      this.billingStates = [];
    }

  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email  is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping  country is " + this.checkoutFormGroup.get('shipping').value.country.name);
    console.log("The shipping  state is " + this.checkoutFormGroup.get('shipping').value.state.name);

  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shipping') {
          this.shippingStates = data;
        }
        else {
          this.billingStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  reviewCartDetails() {
    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )
    //get all cart items that were added before checkout


    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(totalQuantity => this.totalQuantity = totalQuantity)
  }
}
