class PrintPrice {
  constructor() {
    this.printMethodInfo = document.getElementById("InfoPrintMethod");
    this.quantity = document.getElementById("quantity");
    this.priceRangeInput = document.getElementById("price-range");
    this.printMethod = document.getElementById("print-method");
    this.numbersOfColors = document.getElementById("numbers-of-color");
    this.pricePrinting = document.getElementById("price-printing");
    this.priceFinal = document.getElementById("price-final");
    this.divWithCalc = document.getElementById("calc-price-div");
    this.pricePrepress = document.getElementById("price-prepress");
    this.priceProduct = document.getElementById("price-without-inprint");
    this.box = document.getElementById("boxtype");
    this.boxMethod = document.getElementById("box-method");
    this.priceShipment = document.getElementById("price-shippment");
    this.productCode = document.getElementById("mug-id").innerHTML;
    this.discount = 0;
    this.currentShipmentMethod = "zbiorczo";
    this.whatBox = "zbiorczo";
    this.currentShipmentPrice = 0;
    this.indexProductPrice = 0;
    this.printMethodArr = [];
    this.currentMethod = "";
    this.currentNumberOfColors = 1;
    this.quantityValue = 24;
    this.currentProductPrice = 0;
    this.currentPrintPrice = 0;
    this.currentPrepressPrice = 0;
    this.boxPrice = 0;
    this.indexBoxPrice = 0;
    this.colorNumber = 0;
    this.init();
  }

  init() {
    this.getProductPriceIndex();
    this.priceRange();
    this.getPrintMethod();
    this.setPrintMethod();
    this.getIndexOfBoxPrice();
    this.setInputRangeAttributesMinAndMax();
    this.setPrintPrice();
    this.setProductPrice();
    this.setBoxType();
    this.listenPrintingMethodForColors();
    this.listenPrintingMethodForMethod();
    this.listenForChange();
    this.listenColorNumbers();
    this.getBoxType();
    this.setShipmentPrice();
    this.setFinalPrice();
  }

  setShipmentPrice() {
    const stepQuantity = Object.keys(priceBox[this.currentShipmentMethod]);
    const allStepRequirements = stepQuantity.filter(
      (el) => this.quantity.value >= parseInt(el)
    );
    const fitStep = allStepRequirements[allStepRequirements.length - 1];

    if (this.currentShipmentMethod === "zbiorczo") {
      const priceForStep = priceBox[this.currentShipmentMethod][fitStep];
      this.currentShipmentPrice = priceForStep;
      this.priceShipment.value = this.currentShipmentPrice;
    } else {
      const priceForStep = priceBox.jednostkowo[fitStep];
      this.currentShipmentPrice = priceForStep;
      this.priceShipment.value = this.currentShipmentPrice;
    }
  }

  getBoxType() {
    const boxMethodArr = this.boxMethod.innerHTML.split(",").filter(Boolean);
    boxMethodArr.forEach((method) => {
      const element = document.createElement("option");
      element.setAttribute("value", method);
      element.innerHTML = method;
      this.box.append(element);
    });
  }

  setBoxType() {
    this.box.addEventListener("change", (e) => {
      if (e.target.value === "zbiorczo") {
        this.currentShipmentMethod = e.target.value;
        this.whatBox = "zbiorczo";
        this.boxPrice = 0;
      } else {
        this.currentShipmentMethod = "jednostkowo";
        this.whatBox = e.target.value;
        this.getIndexOfBoxPrice();
      }
    });
  }

  getIndexOfBoxPrice() {
    for (let i = 0; i < priceMug.length; i++) {
      if (priceMug[i].code === this.whatBox) this.indexBoxPrice = i;
    }
  }

  setBoxPrice() {
    if (this.whatBox === "zbiorczo") {
      this.boxPrice = 0;
    } else {
      const stepQuantity = Object.keys(priceMug[this.indexBoxPrice]);
      const allStepRequirements = stepQuantity.filter(
        (el) => this.quantity.value >= parseInt(el)
      );
      const fitStep = allStepRequirements[allStepRequirements.length - 1];
      const priceForStep = priceMug[this.indexBoxPrice][fitStep];
      this.boxPrice = priceForStep;
    }
  }

  setInputRangeAttributesMinAndMax() {
    const arr = Object.keys(
      priceRangeColor[this.currentMethod][this.currentNumberOfColors]
    );
    this.priceRangeInput.setAttribute("min", arr[0]);
    this.priceRangeInput.setAttribute("max", arr[arr.length - 1]);
  }

  setFinalPrice() {
    if (
      this.currentMethod === "maxiNB" &&
      this.quantity.value <= 108 &&
      this.currentNumberOfColors > 1
    ) {
      this.priceFinal.value = "Increase quantity to 108";
    } else {
      let price =
        ((this.currentPrintPrice + this.currentProductPrice + this.boxPrice) *
          this.quantity.value +
          this.currentPrepressPrice) /
        this.quantity.value;
      let finalPrice = price - price * this.discount;
      this.priceFinal.value = Math.round(finalPrice * 100) / 100;
    }
  }

  FunctionGoOn() {
    this.getIndexOfBoxPrice();
    this.setBoxType();
    this.setBoxPrice();
    this.setPrintPrice();
    this.setProductPrice();
    this.setShipmentPrice();
    this.setFinalPrice();
  }

  listenForChange() {
    this.divWithCalc.addEventListener("change", () => {
      this.FunctionGoOn();
    });
  }

  setProductPrice() {
    const stepQuantity = Object.keys(priceMug[this.indexProductPrice]);
    const allStepRequirements = stepQuantity.filter(
      (el) => this.quantity.value >= parseInt(el)
    );
    const fitStep = allStepRequirements[allStepRequirements.length - 1];
    const priceForStep = priceMug[this.indexProductPrice][fitStep];
    this.priceProduct.value = priceForStep;
    this.currentProductPrice = priceForStep;
  }

  getProductPriceIndex() {
    for (let i = 0; i < priceMug.length; i++) {
      if (priceMug[i].code === this.productCode) this.indexProductPrice = i;
    }
  }

  listenColorNumbers() {
    this.numbersOfColors.addEventListener("change", (e) => {
      this.currentNumberOfColors = e.target.value;
    });
  }

  priceRange() {
    this.quantity.value = this.priceRangeInput.value;
    this.priceRangeInput.addEventListener("input", (event) => {
      this.quantity.value = event.target.value;
    });
  }

  setPrintPrice() {
    const stepQuantity = Object.keys(
      priceRangeColor[this.currentMethod][this.currentNumberOfColors]
    );
    const allStepRequirements = stepQuantity.filter(
      (el) => this.quantity.value >= parseInt(el)
    );
    const fitStep = allStepRequirements[allStepRequirements.length - 1];
    const priceForStep =
      priceRangeColor[this.currentMethod][this.currentNumberOfColors][fitStep];
    this.pricePrinting.value = priceForStep;
    this.currentPrintPrice = priceForStep;
    this.setPrePressPrice();
  }

  setPrePressPrice() {
    const prepressPrice =
      pricePrepress[this.currentMethod][this.currentNumberOfColors];
    this.pricePrepress.value = prepressPrice;
    this.currentPrepressPrice = prepressPrice;
  }

  listenPrintingMethodForMethod() {
    this.printMethod.addEventListener("change", (event) => {
      this.currentMethod = event.target.value;
    });
  }

  listenPrintingMethodForColors() {
    this.printMethod.addEventListener("change", (event) => {
      this.getNumberOfColors(event.target.value);
    });
  }

  getNumberOfColors(method) {
    this.removeAllColors();
    const arraysNumberOfColors = Object.keys(priceRangeColor[method]);
    arraysNumberOfColors.forEach((color) => {
      const element = document.createElement("option");
      element.setAttribute("value", color);
      element.innerHTML = color;
      this.numbersOfColors.append(element);
    });
  }

  getPrintMethod() {
    let arrWithMethod = this.printMethodInfo.innerHTML;
    this.printMethodArr = arrWithMethod.split(",").filter(Boolean);
    this.currentMethod = this.printMethodArr[0];
  }

  setPrintMethod() {
    this.printMethodArr.forEach((method) => {
      const element = document.createElement("option");
      element.setAttribute("value", method);
      element.innerHTML = methodName[method];
      this.printMethod.append(element);
    });
    this.getNumberOfColors(this.printMethodArr[0]);
  }

  removeAllColors() {
    while (this.numbersOfColors.options.length > 0) {
      this.numbersOfColors.options.remove(0);
    }
  }
}

const pricePriceVar = new PrintPrice();
