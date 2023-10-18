class PrintPrice {
  constructor() {
    this.printMetodInfo = document.getElementById("InfoPrintMetod");
    this.quantity = document.getElementById("quantity");
    this.priceRangeInput = document.getElementById("price-range");
    this.printMethod = document.getElementById("print-method");
    this.numbersColors = document.getElementById("numbers-of-color");
    this.pricePrint = document.getElementById("price-printing");
    this.priceFinal = document.getElementById("price-final");
    this.divWithCalc = document.getElementById("calc-price-div");
    this.pricePrepress = document.getElementById("price-prepress");
    this.priceProduct = document.getElementById("price-without-inprint");
    this.box = document.getElementById("boxtype");
    this.boxMethod = document.getElementById("mox-method");
    this.priceShipment = document.getElementById("price-shippment");
    this.productCode = document.getElementById("mug-id").innerHTML;
    this.discount = 0;
    this.currentShipmentMethod = "zbiorczo";
    this.whatBox = "zbiorczo";
    this.currentShipmentPrice = 0;
    this.indexProductPrice = 0;
    this.printMetodArr = [];
    this.currentMethod = "";
    this.currentNumbersOfColor = 1;
    this.quantityValue = 24;
    this.currentProductPrice = 0;
    this.currentPrintPrice = 0;
    this.currentPrepressPrice = 0;
    this.boxPrice = 0;
    this.indexboxPrice = 0;
    this.colorNumber = 0;
    this.init();
  }
  init() {
    this.getProductPriceIndex();
    this.priceRange();
    this.getPrintMethod();
    this.setPrintMethod();
    this.getIndexOfBoxPrice();
    this.setInputRangeAtributesMinAndMax();
    this.setPrintPrice();
    this.setProductPrice();
    this.setBoxType();
    this.listenerPrintingMetodForColors();
    this.listenerPrintingMethodForMethod();
    this.listnerForChange();
    this.listnerColorNumbers();
    this.getBoxType();
    this.setShipmentPrice();
    this.setFinalPrice();
  }
  setShipmentPrice() {
    let stepQuantity = Object.keys(priceBox[this.currentShipmentMethod]);

    let allStepRequariements = stepQuantity.filter(
      (el) => this.quantity.value >= parseInt(el)
    );
    let fitStep = allStepRequariements[allStepRequariements.length - 1];

    if (this.currentShipmentMethod === "zbiorczo") {
      let priceForStep = priceBox[this.currentShipmentMethod][fitStep];
      this.currentShipmentPrice = priceForStep;
      this.priceShipment.value = this.currentShipmentPrice;
    } else {
      let priceForStep = priceBox.jednostkowo[fitStep];
      this.currentShipmentPrice = priceForStep;
      this.priceShipment.value = this.currentShipmentPrice;
    }
  }

  //zbiorczo default transport and other method from div inner
  getBoxType() {
    let boxMethodArr = this.boxMethod.innerHTML.split(",").filter(Boolean);
    boxMethodArr.forEach((method) => {
      const elemento = document.createElement("option");
      elemento.setAttribute("value", method);
      elemento.innerHTML = method;
      this.box.append(elemento);
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
    // Search index of arrays with price
    console.log("index pudelka", this.indexboxPrice);
    for (let i = 0; i < priceMug.length; i++) {
      if (priceMug[i].code === this.whatBox) this.indexboxPrice = i;
    }
    console.log("index pudelka", this.indexboxPrice);
  }

  setBoxPrice() {
    if (this.whatBox === "zbiorczo") {
      this.boxPrice = 0;
    } else {
      let stepQuantity = Object.keys(priceMug[this.indexboxPrice]);
      let allStepRequariements = stepQuantity.filter(
        (el) => this.quantity.value >= parseInt(el)
      );
      let fitStep = allStepRequariements[allStepRequariements.length - 1];
      let priceForStep = priceMug[this.indexboxPrice][fitStep];
      this.boxPrice = priceForStep;
    }
  }

  //set max and min range input from product min and max price range
  setInputRangeAtributesMinAndMax() {
    let arr = Object.keys(
      priceRangeColor[this.currentMethod][this.currentNumbersOfColor]
    );
    this.priceRangeInput.setAttribute("min", arr[0]);
    this.priceRangeInput.setAttribute("max", arr[arr.length - 1]);
  }
  setFinalPrice() {
    //error for NB method
    if (
      this.currentMethod === "maxiNB" &&
      this.quantity.value <= 108 &&
      this.currentNumbersOfColor > 1
    ) {
      this.priceFinal.value = "zwiększ liczbe sztuk do 108";
    } else {
      let price = 0;
      price =
        ((this.currentPrintPrice + this.currentProductPrice + this.boxPrice) *
          this.quantity.value +
          this.currentPrepressPrice) /
        this.quantity.value;
      let finalPrice = 0;
      finalPrice = price - price * this.discount;
      this.priceFinal.value = Math.round(finalPrice * 100) / 100;
    }
  }
  //all functions to work if something change
  FunctionGoOn() {
    this.getIndexOfBoxPrice();
    this.setBoxType();
    this.setBoxPrice();
    this.setPrintPrice();
    this.setProductPrice();
    this.setShipmentPrice();
    this.setFinalPrice();
  }

  listnerForChange() {
    this.divWithCalc.addEventListener("change", () => {
      this.FunctionGoOn();
    });
  }

  setProductPrice() {
    let stepQuantity = Object.keys(priceMug[this.indexProductPrice]);

    let allStepRequariements = stepQuantity.filter(
      (el) => this.quantity.value >= parseInt(el)
    );

    let fitStep = allStepRequariements[allStepRequariements.length - 1];

    let priceForStep = priceMug[this.indexProductPrice][fitStep];
    this.priceProduct.value = priceForStep;
    this.currentProductPrice = priceForStep;
  }

  getProductPriceIndex() {
    // Search index of arrays with price
    for (let i = 0; i < priceMug.length; i++) {
      if (priceMug[i].code === this.productCode) this.indexProductPrice = i;
    }
  }

  listnerColorNumbers() {
    this.numbersColors.addEventListener("change", (e) => {
      this.currentNumbersOfColor = e.target.value;
    });
  }

  //Listen range and change quantity in div and for calc
  priceRange() {
    this.quantity.value = this.priceRangeInput.value;
    this.priceRangeInput.addEventListener("input", (event) => {
      this.quantity.value = event.target.value;
    });
  }

  setPrintPrice() {
    let stepQuantity = Object.keys(
      priceRangeColor[this.currentMethod][this.currentNumbersOfColor]
    );
    let allStepRequariements = stepQuantity.filter(
      (el) => this.quantity.value >= parseInt(el)
    );

    let fitStep = allStepRequariements[allStepRequariements.length - 1];
    let priceForStep =
      priceRangeColor[this.currentMethod][this.currentNumbersOfColor][fitStep];
    this.pricePrint.value = priceForStep;
    this.currentPrintPrice = priceForStep;
    this.setPrePressPrice();
  }

  setPrePressPrice() {
    let prepressprice =
      pricePrepress[this.currentMethod][this.currentNumbersOfColor];
    this.pricePrepress.value = prepressprice;
    this.currentPrepressPrice = prepressprice;
  }

  //Listen for changing printing method
  listenerPrintingMethodForMethod() {
    this.printMethod.addEventListener("change", (event) => {
      this.currentMethod = event.target.value;
    });
  }
  // listen for change in number of colors per method
  listenerPrintingMetodForColors() {
    this.printMethod.addEventListener("change", (event) => {
      this.getNumberOfColors(event.target.value);
    });
  }

  //seting options value with number of color per method and change number
  getNumberOfColors(method) {
    //first clear options before add new
    this.removeAllcolors();
    // Create arrays with colors
    let arraysNumberColor = Object.keys(priceRangeColor[method]);
    arraysNumberColor.forEach((color) => {
      const elemento = document.createElement("option");
      elemento.setAttribute("value", color);
      elemento.innerHTML = color;
      this.numbersColors.append(elemento);
    });
  }

  //create array with printing method from div html
  getPrintMethod() {
    let arrwithmethod = "";
    arrwithmethod = this.printMetodInfo.innerHTML;

    this.printMetodArr = arrwithmethod.split(",").filter(Boolean);
    this.currentMethod = this.printMetodArr[0];
  }

  // creating new option value for every method of printing
  setPrintMethod() {
    this.printMetodArr.forEach((method) => {
      const elemento = document.createElement("option");
      elemento.setAttribute("value", method);
      elemento.innerHTML = methodName[method];
      this.printMethod.append(elemento);
    });
    this.getNumberOfColors(this.printMetodArr[0]);
  }

  // clear color select options
  removeAllcolors() {
    while (this.numbersColors.options.length > 0) {
      this.numbersColors.options.remove(0);
    }
  }
}

const pricePriceVar = new PrintPrice();
