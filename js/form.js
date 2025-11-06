let podborData = {};
let isPopupClosing = false;
let isProcessingClick = false;
let isFormSubmitting = false;

document.addEventListener("DOMContentLoaded", function () {
  initAllForms();
  initSpecialForms();
  initSubmitButtons();
  initPopupButtons();
  saveOriginalPopupForm();
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

  const allFieldsToValidate = getFormFields(form);

  hideAllErrors(form);

  const validationResult = validateAllFields(allFieldsToValidate);

  if (!validationResult.isValid) {
    if (validationResult.firstErrorField) {
      validationResult.firstErrorField.focus();
    }

    isFormSubmitting = false;
    return false;
  }

  const formData = {};
  allFieldsToValidate.forEach((field) => {
    const fieldName = field.getAttribute("name");
    const fieldType = field.getAttribute("type");

    if (fieldType === "checkbox") {
      if (field.checked) {
        if (!formData[fieldName]) {
          formData[fieldName] = [];
        }
        formData[fieldName].push(field.value);
      }
    } else {
      const fieldValue = field.value.trim();
      if (fieldValue) {
        formData[fieldName] = fieldValue;
      }
    }
  });

  Object.keys(formData).forEach((key) => {
    if (Array.isArray(formData[key])) {
      formData[key] = formData[key].join(", ");
    }
  });

  const combinedData = {
    ...podborData,
    ...formData,
    formType: form.getAttribute("name"),
    submittedAt: new Date().toISOString(),
  };

  console.log("📊 Данные:", combinedData);

  const submitBtn = form.querySelector(
    'input[type="submit"], button[type="submit"]'
  );
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.style.cursor = "not-allowed";
  }

  setTimeout(() => {
    showSuccessMessage(form);
    isFormSubmitting = false;
  }, 1000);

  return true;
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
    showFieldError(field, "Укажите email");
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

function initSubmitButtons() {
  const buttons = [
    'input[type="submit"][value="Получить коммерческое предложение"][data-context="commercial-form"]',
    'input[type="submit"][value="Задать вопрос"][data-context="question-form"]',
    'input[type="submit"][id="submit_btn"][data-context="popup"]',
  ];

  buttons.forEach((selector) => {
    const button = document.querySelector(selector);
    if (button) {
      const form = button.closest("form");
      if (form) {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          handleFormSubmit(form);
        });
      }
    }
  });
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
    }
  });
}

function initPhoneFields(form) {
  const phoneInputs = form.querySelectorAll('input[name="user_phone"]');
  phoneInputs.forEach((phoneInput) => {
    if (!phoneInput.value) {
      phoneInput.value = "+7 ";
    }
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
  initSubmitButtons();

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

function savePodborData(selectedSpecialties, employeeCount, profession = null) {
  podborData = {
    selectedSpecialties: selectedSpecialties,
    employeeCount: employeeCount,
    selectedProfession: profession,
    timestamp: new Date().toISOString(),
  };
}

const style = document.createElement("style");
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .button-spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
