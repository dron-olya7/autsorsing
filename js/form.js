let podborData = {};
let isPopupClosing = false;
let isProcessingClick = false;
let isProcessingCheckbox = false;
let isFormSubmitting = false;

document.addEventListener("DOMContentLoaded", function () {
  initAllForms();
  initSpecialForms();
  initAllSubmitButtons();
  initPopupButtons();
  saveOriginalPopupForm();
  initDynamicContactFields();
});

function saveOriginalPopupForm() {
  const popupForm = document.querySelector(".popup.form form");
  if (popupForm && !popupForm.hasAttribute("data-original-saved")) {
    const originalHTML = popupForm.innerHTML;
    popupForm.setAttribute("data-original-html", originalHTML);
    popupForm.setAttribute("data-original-saved", "true");
  }
}

function showSuccessMessage(form) {
  const originalFormHTML = form.innerHTML;

  const successHTML = `
        <div class="success-message"> 
            <h2>Спасибо за заявку!</h2>
            <p>Мы свяжемся с вами в ближайшее время</p>
        </div>
    `;

  form.innerHTML = successHTML;
  form.classList.add("success-state");
  form.setAttribute("data-original-html", originalFormHTML);

  const popup = form.closest(".popup");
  if (popup) {
    setTimeout(() => {
      closePopup(popup);
    }, 3000);
  }
}

function handleFormSubmit(form) {
  if (isFormSubmitting) {
    console.log("Форма уже отправляется...");
    return false;
  }

  isFormSubmitting = true;

  const submitBtn = form.querySelector(
    'input[type="submit"], button[type="submit"]'
  );
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.style.cursor = "not-allowed";
  }

  // Собираем данные формы для вывода в консоль
  const formData = collectFormData(form);
  console.log('📧 Форма отправлена:', formData);

  setTimeout(() => {
    showSuccessMessage(form);
    isFormSubmitting = false;
  }, 1000);

  return true;
}

// Функция для сбора данных формы в JSON-формате
function collectFormData(form) {
  const formData = {
    contactData: '',
    contactMethod: [],
    timestamp: new Date().toLocaleString('ru-RU'),
    date: new Date().toISOString(),
    additionalData: {},
    calculatorData: {}
  };

  // Собираем контактные данные
  const phoneInput = form.querySelector('input[name="user_phone"]');
  const emailInput = form.querySelector('input[name="user_email"]');
  
  if (phoneInput && phoneInput.style.display !== 'none' && phoneInput.value) {
    formData.contactData = phoneInput.value;
  } else if (emailInput && emailInput.style.display !== 'none' && emailInput.value) {
    formData.contactData = emailInput.value;
  }

  // Собираем выбранные способы связи
  const contactCheckboxes = form.querySelectorAll('input[name="contact_method"]:checked');
  formData.contactMethod = Array.from(contactCheckboxes).map(checkbox => checkbox.value);

  // Собираем дополнительные поля
  const nameInput = form.querySelector('input[name="user_name"]');
  if (nameInput && nameInput.value) {
    formData.additionalData.userName = nameInput.value;
  }

  const messageTextarea = form.querySelector('textarea[name="user_message"]');
  if (messageTextarea && messageTextarea.value) {
    formData.additionalData.userMessage = messageTextarea.value;
  }

  // Добавляем данные о профессии если есть
  if (podborData.selectedProfession) {
    formData.additionalData.profession = podborData.selectedProfession;
  }

  // Собираем данные из калькулятора (блока calculate)
  const calculatorData = collectCalculatorData();
  if (Object.keys(calculatorData).length > 0) {
    formData.calculatorData = calculatorData;
  }

  return formData;
}

// Функция для сбора данных из калькулятора
function collectCalculatorData() {
  const calculatorData = {};
  
  // Находим блок калькулятора
  const calculatorBlock = document.querySelector('.block.calculate');
  if (!calculatorBlock) return calculatorData;

  try {
    // Собираем выбранные специальности
    const selectedItems = calculatorBlock.querySelectorAll('.selected-item');
    if (selectedItems.length > 0) {
      calculatorData.selectedSpecialties = Array.from(selectedItems).map(item => {
        return item.textContent.replace('×', '').trim();
      });
    }

    // Собираем выбранные специальности из скрытого select
    const specialtySelect = calculatorBlock.querySelector('#specialtySelect');
    if (specialtySelect) {
      const selectedOptions = Array.from(specialtySelect.selectedOptions);
      if (selectedOptions.length > 0) {
        calculatorData.specialtiesFromSelect = selectedOptions.map(option => option.value);
      }
    }

    // Собираем количество сотрудников
    const rangeSlider = calculatorBlock.querySelector('#rangeSlider');
    const counterInput = calculatorBlock.querySelector('#counterInput');
    
    if (rangeSlider) {
      calculatorData.employeeCount = parseInt(rangeSlider.value);
    } else if (counterInput && counterInput.value) {
      calculatorData.employeeCount = parseInt(counterInput.value);
    }

    // Собираем информацию о диапазоне
    const rangeInfo = calculatorBlock.querySelector('.range-info');
    if (rangeInfo) {
      calculatorData.rangeInfo = rangeInfo.textContent.trim();
    }

    // Добавляем контекст если это калькулятор
    const calculateBtn = calculatorBlock.querySelector('.calculate-btn');
    if (calculateBtn && calculateBtn.getAttribute('data-context') === 'calculator-block') {
      calculatorData.context = 'calculator-block';
      calculatorData.action = calculateBtn.getAttribute('data-action');
    }

    // Добавляем timestamp калькулятора
    calculatorData.calculatorTimestamp = new Date().toISOString();

  } catch (error) {
    console.error('Ошибка при сборе данных калькулятора:', error);
  }

  return calculatorData;
}

// Функция для сохранения данных калькулятора в podborData
function saveCalculatorData() {
  const calculatorBlock = document.querySelector('.block.calculate');
  if (!calculatorBlock) return;

  try {
    // Собираем выбранные специальности
    const selectedItems = calculatorBlock.querySelectorAll('.selected-item');
    const selectedSpecialties = Array.from(selectedItems).map(item => {
      return item.textContent.replace('×', '').trim();
    });

    // Собираем количество сотрудников
    const rangeSlider = calculatorBlock.querySelector('#rangeSlider');
    const counterInput = calculatorBlock.querySelector('#counterInput');
    let employeeCount = 1;
    
    if (rangeSlider) {
      employeeCount = parseInt(rangeSlider.value);
    } else if (counterInput && counterInput.value) {
      employeeCount = parseInt(counterInput.value);
    }

    // Сохраняем в podborData
    podborData.calculator = {
      selectedSpecialties: selectedSpecialties,
      employeeCount: employeeCount,
      timestamp: new Date().toISOString()
    };

    console.log('Данные калькулятора сохранены:', podborData.calculator);

  } catch (error) {
    console.error('Ошибка при сохранении данных калькулятора:', error);
  }
}

function getFormFields(form) {
  const fields = [];

  const requiredFields = form.querySelectorAll("[required]");
  fields.push(...requiredFields);

  const specialFields = form.querySelectorAll(
    'input[name="user_phone"], input[name="user_email"], input[name="user_name"], textarea[name="user_message"]'
  );

  specialFields.forEach((field) => {
    if (!fields.includes(field)) {
      fields.push(field);
    }
  });

  const contactMethodCheckboxes = form.querySelectorAll(
    'input[name="contact_method"]'
  );
  contactMethodCheckboxes.forEach((checkbox) => {
    if (!fields.includes(checkbox)) {
      fields.push(checkbox);
    }
  });

  return fields;
}

function hideAllErrors(form) {
  const errorMessages = form.querySelectorAll(".error-message");
  errorMessages.forEach((error) => {
    error.classList.remove("show");
  });

  const errorFields = form.querySelectorAll(".error");
  errorFields.forEach((field) => {
    field.classList.remove("error");
  });

  const inputWrappers = form.querySelectorAll(".input-wrapper");
  inputWrappers.forEach((wrapper) => {
    wrapper.classList.remove("has-error");
  });
}

function validateAllFields(fields) {
  let isValid = true;
  let firstErrorField = null;
  const errorFields = [];

  fields.forEach((field) => {
    if (field.type === "checkbox" && !field.checked) {
      return;
    }

    const fieldIsValid = validateSingleField(field);

    if (!fieldIsValid) {
      isValid = false;
      errorFields.push(field);

      if (!firstErrorField) {
        firstErrorField = field;
      }
    }
  });

  return {
    isValid,
    firstErrorField,
    errorFields,
  };
}

function validateSingleField(field) {
  if (field.type === "checkbox") {
    hideFieldError(field);
    return true;
  }

  const value = field.value.trim();
  const fieldName = field.getAttribute("name");

  if (field.hasAttribute("required") && !value) {
    showFieldError(field, getRequiredFieldMessage(fieldName));
    return false;
  }

  if (value) {
    if (fieldName === "user_name") {
      return validateNameField(field);
    } else if (fieldName === "user_email") {
      return validateEmailField(field);
    } else if (fieldName === "user_phone") {
      return validatePhoneField(field);
    } else if (fieldName === "user_message") {
      return validateMessageField(field);
    }
  }

  if (!field.hasAttribute("required") && !value) {
    hideFieldError(field);
    return true;
  }

  hideFieldError(field);
  return true;
}

function getRequiredFieldMessage(fieldName) {
  const messages = {
    user_name: "Укажите имя",
    user_phone: "Укажите телефон",
    user_email: "Укажите email",
    user_message: "Заполните сообщение",
  };

  return messages[fieldName] || "Заполните это поле";
}

function validateNameField(field) {
  const value = field.value.trim();

  if (value.length < 2) {
    showFieldError(field, "Имя должно содержать минимум 2 символа");
    return false;
  }

  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
  if (!nameRegex.test(value)) {
    showFieldError(field, "Имя может содержать только буквы, пробелы и дефисы");
    return false;
  }

  hideFieldError(field);
  return true;
}

function validateEmailField(field) {
  const value = field.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    showFieldError(field, "Укажите корректный email");
    return false;
  }

  hideFieldError(field);
  return true;
}

function validatePhoneField(field) {
  const value = field.value.replace(/\D/g, "");
  const cleanValue = value.replace(/^(\+7|7|8)/, "");

  if (cleanValue.length < 10) {
    const remainingDigits = 10 - cleanValue.length;
    showFieldError(
      field,
      `Ещё ${remainingDigits} ${getDigitWord(remainingDigits)}`
    );
    return false;
  }

  hideFieldError(field);
  return true;
}

function validateMessageField(field) {
  const value = field.value.trim();

  if (value.length < 5) {
    showFieldError(field, "Сообщение должно содержать минимум 5 символов");
    return false;
  }

  hideFieldError(field);
  return true;
}

function showFieldError(field, message) {
  let wrapper = field.closest(".input-wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "input-wrapper";
    field.parentNode.insertBefore(wrapper, field);
    wrapper.appendChild(field);
  }

  let errorElement = wrapper.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("span");
    errorElement.className = "error-message";
    wrapper.appendChild(errorElement);
  }

  errorElement.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${message}
    `;

  errorElement.classList.add("show");
  wrapper.classList.add("has-error");
  field.classList.add("error");
}

function hideFieldError(field) {
  const wrapper = field.closest(".input-wrapper");
  if (!wrapper) return;

  const errorElement = wrapper.querySelector(".error-message");
  if (errorElement) {
    errorElement.classList.remove("show");
  }

  wrapper.classList.remove("has-error");
  field.classList.remove("error");
}

function getDigitWord(count) {
  if (count === 1) return "цифра";
  if (count >= 2 && count <= 4) return "цифры";
  return "цифр";
}

function initAllSubmitButtons() {
  // Все кнопки которые нужно обработать
  const buttonSelectors = [
    'input[type="submit"][data-action="get-commercial-offer"]', // Получить коммерческое предложение
    'input[type="submit"][data-action="ask-question"]', // Задать вопрос
    'input[type="submit"][id="submit_btn"]', // Получить чек-листы
    '.calculate-btn.zakazat_pers', // Кнопка калькулятора
  ];

  buttonSelectors.forEach((selector) => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        
        // Если это кнопка калькулятора, сохраняем данные калькулятора
        if (this.classList.contains('calculate-btn')) {
          saveCalculatorData();
        }
        
        const form = this.closest("form");
        if (form) {
          validateFormAndShowErrors(form);
        }
      });
    });
  });
}

function validateFormAndShowErrors(form) {
  // Скрываем все предыдущие ошибки
  hideAllErrors(form);

  let isValid = true;
  let firstErrorField = null;

  // Получаем все обязательные поля
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    const value = field.value.trim();
    const fieldName = field.getAttribute("name");

    if (!value) {
      // Поле пустое - показываем ошибку
      showFieldError(field, getRequiredFieldMessage(fieldName));
      isValid = false;

      if (!firstErrorField) {
        firstErrorField = field;
      }
    } else {
      // Поле заполнено, проверяем валидность
      if (fieldName === "user_email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showFieldError(field, "Укажите корректный email");
          isValid = false;
          if (!firstErrorField) firstErrorField = field;
        }
      } else if (fieldName === "user_phone") {
        const phoneDigits = value.replace(/\D/g, "").replace(/^(\+7|7|8)/, "");
        if (phoneDigits.length < 10) {
          const remainingDigits = 10 - phoneDigits.length;
          showFieldError(
            field,
            `Ещё ${remainingDigits} ${getDigitWord(remainingDigits)}`
          );
          isValid = false;
          if (!firstErrorField) firstErrorField = field;
        }
      } else if (fieldName === "user_name") {
        if (value.length < 2) {
          showFieldError(field, "Имя должно содержать минимум 2 символа");
          isValid = false;
          if (!firstErrorField) firstErrorField = field;
        }
      } else if (fieldName === "user_message") {
        if (value.length < 5) {
          showFieldError(
            field,
            "Сообщение должно содержать минимум 5 символов"
          );
          isValid = false;
          if (!firstErrorField) firstErrorField = field;
        }
      }
    }
  });

  // Фокусируемся на первом поле с ошибкой
  if (firstErrorField) {
    firstErrorField.focus();
  }

  // Если форма валидна, отправляем ее
  if (isValid) {
    handleFormSubmit(form);
  }
}

function initAllForms() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    initPhoneFields(form);
    initRealTimeValidation(form);
  });
}

function initSpecialForms() {
  const specialForms = ["form_0", "form_1", "form_2"];
  specialForms.forEach((formName) => {
    const form =
      document.querySelector(`form[name="${formName}"]`) ||
      document.querySelector('.popup.form form[name="form_2"]');
    if (form) {
      initPhoneFields(form);
      initRealTimeValidation(form);
      initDynamicContactFields();
    }
  });
}

function initPhoneFields(form) {
  const phoneInputs = form.querySelectorAll('input[name="user_phone"]');
  phoneInputs.forEach((phoneInput) => {
    if (!phoneInput.value) {
      phoneInput.value = "+7 ";
    }

    // Добавляем маску для телефона
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      if (value.startsWith("7") || value.startsWith("8")) {
        value = "7" + value.substring(1);
      }

      let formattedValue = "+7 ";
      if (value.length > 1) {
        formattedValue += value.substring(1, 4);
      }
      if (value.length > 4) {
        formattedValue += " " + value.substring(4, 7);
      }
      if (value.length > 7) {
        formattedValue += "-" + value.substring(7, 9);
      }
      if (value.length > 9) {
        formattedValue += "-" + value.substring(9, 11);
      }

      e.target.value = formattedValue;
    });
  });
}

function initRealTimeValidation(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateSingleField(this);
    });
  });
}

function resetForm(form) {
  const originalHTML = form.getAttribute("data-original-html");
  if (originalHTML) {
    form.innerHTML = originalHTML;
  }

  form.classList.remove("success-state");
  form.reset();

  const submitBtn = form.querySelector(
    'input[type="submit"], button[type="submit"]'
  );
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
  }

  initPhoneFields(form);
  initRealTimeValidation(form);
  initDynamicContactFields();
  initAllSubmitButtons();

  isFormSubmitting = false;
}

function closePopup(popup) {
  if (popup) {
    isPopupClosing = true;

    const form = popup.querySelector("form");
    if (form) {
      resetForm(form);
    }

    popup.style.opacity = "0";
    popup.style.visibility = "hidden";

    const shadow = document.querySelector(".shadow");
    if (shadow) {
      shadow.style.opacity = "0";
      shadow.style.visibility = "hidden";
    }

    podborData.selectedProfession = null;

    setTimeout(() => {
      popup.style.display = "none";
      if (shadow) {
        shadow.style.display = "none";
      }
      isPopupClosing = false;
    }, 300);
  }
}

function openPopup(popup) {
  if (popup) {
    popup.style.display = "block";

    setTimeout(() => {
      popup.style.opacity = "1";
      popup.style.visibility = "visible";
    }, 10);

    const shadow = document.querySelector(".shadow");
    if (shadow) {
      shadow.style.display = "block";
      setTimeout(() => {
        shadow.style.opacity = "1";
        shadow.style.visibility = "visible";
      }, 10);
    }

    const form = popup.querySelector("form");
    if (form) {
      resetForm(form);
    }
  }
}

function showButtonLoader(button) {
  const originalText = button.innerHTML;
  button.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <div class="button-spinner" style="width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            Обработка...
        </div>
    `;
  button.disabled = true;
  button.style.opacity = "0.7";
  button.style.cursor = "not-allowed";
  button.setAttribute("data-original-text", originalText);
}

function hideButtonLoader(button) {
  const originalText = button.getAttribute("data-original-text");
  if (originalText) {
    button.innerHTML = originalText;
  }
  button.disabled = false;
  button.style.opacity = "1";
  button.style.cursor = "pointer";
  button.removeAttribute("data-original-text");
}

function initPopupButtons() {
  document.addEventListener("click", function (e) {
    const openBtn =
      e.target.closest(".zakazat_pers") || e.target.closest(".zakazat_zvonok");

    if (openBtn && !isProcessingClick) {
      e.preventDefault();
      isProcessingClick = true;

      showButtonLoader(openBtn);

      const profession = openBtn.getAttribute("data-profession");

      if (profession) {
        podborData.selectedProfession = profession;
      }

      // Если это кнопка калькулятора, сохраняем данные калькулятора
      if (openBtn.classList.contains('calculate-btn')) {
        saveCalculatorData();
      }

      const popup =
        document.querySelector(".popup.form") ||
        document.getElementById("popup") ||
        document.querySelector(".popup");

      if (popup) {
        openPopup(popup);

        setTimeout(() => {
          hideButtonLoader(openBtn);
          isProcessingClick = false;
        }, 300);
      } else {
        console.error("Попап не найден");
        hideButtonLoader(openBtn);
        isProcessingClick = false;
      }
    }
  });
}

// Функции для динамического изменения полей контактов
function initDynamicContactFields() {
  const contactCheckboxes = document.querySelectorAll(
    'input[name="contact_method"]'
  );

  contactCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (isProcessingCheckbox) return;

      isProcessingCheckbox = true;

      if (this.checked) {
        // Снимаем выделение со всех других чекбоксов
        contactCheckboxes.forEach((otherCheckbox) => {
          if (otherCheckbox !== this) {
            otherCheckbox.checked = false;
          }
        });
      } else {
        // Если сняли последний чекбокс, оставляем его выбранным
        const checkedCount = document.querySelectorAll(
          'input[name="contact_method"]:checked'
        ).length;
        if (checkedCount === 0) {
          this.checked = true;
        }
      }

      updateContactField();

      setTimeout(() => {
        isProcessingCheckbox = false;
      }, 10);
    });
  });

  // Инициализируем поле при загрузке
  updateContactField();
}

function updateContactField() {
  const form = document.querySelector(".popup.form form");
  if (!form) return;

  const selectedMethods = getSelectedContactMethods();
  const phoneWrapper = form.querySelector(".input-wrapper");

  if (!phoneWrapper) return;

  const currentInput = phoneWrapper.querySelector(
    'input[name="user_phone"], input[name="user_email"]'
  );

  // Если выбран только email - показываем поле email
  if (selectedMethods.length === 1 && selectedMethods[0] === "email") {
    showEmailField(phoneWrapper, currentInput);
  }
  // Если выбран любой другой метод (whatsapp, telegram, max) - показываем поле телефона
  else if (selectedMethods.length > 0) {
    showPhoneField(phoneWrapper, currentInput);
  }
  // Если ничего не выбрано - показываем поле телефона по умолчанию
  else {
    showPhoneField(phoneWrapper, currentInput);
  }
}

function getSelectedContactMethods() {
  const selectedMethods = [];
  const checkboxes = document.querySelectorAll(
    'input[name="contact_method"]:checked'
  );

  checkboxes.forEach((checkbox) => {
    selectedMethods.push(checkbox.value);
  });

  return selectedMethods;
}

function showEmailField(wrapper, currentInput) {
  // Если уже есть поле email, просто активируем его
  let emailInput = wrapper.querySelector('input[name="user_email"]');

  if (emailInput) {
    // Показываем email поле
    emailInput.style.display = "block";
    emailInput.required = true;

    // Скрываем и деактивируем поле телефона если оно есть
    const phoneInput = wrapper.querySelector('input[name="user_phone"]');
    if (phoneInput) {
      phoneInput.style.display = "none";
      phoneInput.required = false;
    }

    // Обновляем плейсхолдер и сообщение об ошибке
    emailInput.placeholder = "Ваш email";
    updateErrorMessage(wrapper, "email");
    return;
  }

  // Создаем новое поле email
  emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.name = "user_email";
  emailInput.placeholder = "Ваш email";
  emailInput.required = true;
  emailInput.className = currentInput ? currentInput.className : "";

  // Скрываем текущее поле
  if (currentInput) {
    currentInput.style.display = "none";
    currentInput.required = false;
  }

  wrapper.insertBefore(emailInput, wrapper.querySelector(".error-message"));

  // Обновляем сообщение об ошибке
  updateErrorMessage(wrapper, "email");

  // Добавляем валидацию для email
  emailInput.addEventListener("blur", function () {
    validateSingleField(this);
  });
}

function showPhoneField(wrapper, currentInput) {
  // Если уже есть поле телефона, просто активируем его
  let phoneInput = wrapper.querySelector('input[name="user_phone"]');

  if (phoneInput) {
    // Показываем поле телефона
    phoneInput.style.display = "block";
    phoneInput.required = true;

    // Скрываем и деактивируем поле email если оно есть
    const emailInput = wrapper.querySelector('input[name="user_email"]');
    if (emailInput) {
      emailInput.style.display = "none";
      emailInput.required = false;
    }

    // Обновляем плейсхолдер и сообщение об ошибке
    phoneInput.placeholder = "Ваш номер телефона";
    updateErrorMessage(wrapper, "phone");

    // Инициализируем маску телефона
    if (!phoneInput.value || phoneInput.value === "") {
      phoneInput.value = "+7 ";
    }
    return;
  }

  // Создаем новое поле телефона
  phoneInput = document.createElement("input");
  phoneInput.type = "text";
  phoneInput.name = "user_phone";
  phoneInput.placeholder = "Ваш номер телефона";
  phoneInput.required = true;
  phoneInput.className = currentInput ? currentInput.className : "";

  // Инициализируем маску телефона
  if (!phoneInput.value) {
    phoneInput.value = "+7 ";
  }

  // Добавляем маску для телефона
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.startsWith("7") || value.startsWith("8")) {
      value = "7" + value.substring(1);
    }

    let formattedValue = "+7 ";
    if (value.length > 1) {
      formattedValue += value.substring(1, 4);
    }
    if (value.length > 4) {
      formattedValue += " " + value.substring(4, 7);
    }
    if (value.length > 7) {
      formattedValue += "-" + value.substring(7, 9);
    }
    if (value.length > 9) {
      formattedValue += "-" + value.substring(9, 11);
    }

    e.target.value = formattedValue;
  });

  // Скрываем текущее поле
  if (currentInput) {
    currentInput.style.display = "none";
    currentInput.required = false;
  }

  wrapper.insertBefore(phoneInput, wrapper.querySelector(".error-message"));

  // Обновляем сообщение об ошибке
  updateErrorMessage(wrapper, "phone");

  // Добавляем валидацию для телефона
  phoneInput.addEventListener("blur", function () {
    validateSingleField(this);
  });
}

function updateErrorMessage(wrapper, fieldType) {
  const errorElement = wrapper.querySelector(".error-message");
  if (!errorElement) return;

  if (fieldType === "email") {
    errorElement.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Укажите email
    `;
  } else {
    errorElement.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Укажите телефон
    `;
  }
}

function savePodborData(selectedSpecialties, employeeCount, profession = null) {
  podborData = {
    selectedSpecialties: selectedSpecialties,
    employeeCount: employeeCount,
    selectedProfession: profession,
    timestamp: new Date().toISOString(),
  };
}

// Обработчики закрытия попапа
document.addEventListener("click", function (e) {
  if (
    e.target.closest(".close_popup_form") ||
    e.target.closest(".close_popup_form svg") ||
    e.target.closest(".close_popup_form path") ||
    e.target.closest(".popup-close") ||
    e.target.classList.contains("popup-close")
  ) {
    const popup = e.target.closest(".popup");
    closePopup(popup);
  }

  if (e.target.classList.contains("shadow")) {
    const popups = document.querySelectorAll(".popup");
    popups.forEach((popup) => {
      if (popup.style.opacity === "1" || popup.style.visibility === "visible") {
        closePopup(popup);
      }
    });
  }
});

document.addEventListener("touch", function (e) {
  if (
    e.target.closest(".close_popup_form") ||
    e.target.closest(".close_popup_form svg") ||
    e.target.closest(".close_popup_form path") ||
    e.target.closest(".popup-close") ||
    e.target.classList.contains("popup-close")
  ) {
    const popup = e.target.closest(".popup");
    closePopup(popup);
  }

  if (e.target.classList.contains("shadow")) {
    const popups = document.querySelectorAll(".popup");
    popups.forEach((popup) => {
      if (popup.style.opacity === "1" || popup.style.visibility === "visible") {
        closePopup(popup);
      }
    });
  }
});

const style = document.createElement("style");
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .button-spinner {
        animation: spin 1s linear infinite;
    }
    
    .social-checkbox input[type="checkbox"] {
        cursor: pointer;
    }
    
    .social-checkbox {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .social-checkbox:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);
