// Полный код с всеми необходимыми функциями
document.addEventListener('DOMContentLoaded', function() {
    // console.log('=== ИНИЦИАЛИЗАЦИЯ ФОРМ И КНОПОК ===');
    
    // Инициализируем все формы
    initAllForms();
    
    // Инициализируем специальные формы
    initSpecialForms();
    
    // Инициализируем кнопки отправки
    initSubmitButtons();
});

// Основная функция обработки отправки формы
// Сообщение об успехе
function showSuccessMessage(form) {
    // console.log('🎉 Форма успешно отправлена!');
    
    // Сохраняем оригинальный HTML формы
    const originalFormHTML = form.innerHTML;
    const formWrapper = form.parentNode;
    
    // Создаем HTML для сообщения "Спасибо"
    const successHTML = `
        <div class="success-message"> 
                <h2>
                    Спасибо за заявку!
                </h2>
                <p>
                    Мы свяжемся с вами в ближайшее время
                </p>
           
        </div>
    `;
    
    // Заменяем содержимое формы на сообщение "Спасибо"
    form.innerHTML = successHTML;
    
    // Добавляем класс для стилизации
    form.classList.add('success-state');
    
    // Сохраняем оригинальный HTML в data-атрибут для возможности восстановления
    form.setAttribute('data-original-html', originalFormHTML);
    
    // Для попапов - закрываем их через 3 секунды
    const popup = form.closest('.popup');
    if (popup) {
        setTimeout(() => {
            popup.style.display = 'none';
            document.querySelector('.shadow').style.display = 'none';
            
            // Восстанавливаем оригинальную форму для следующего использования
            form.innerHTML = originalFormHTML;
            form.classList.remove('success-state');
            
            // Реинициализируем форму
            initPhoneFields(form);
            initRealTimeValidation(form);
            initSubmitButtons();
            
        }, 3000);
    }
    
    // console.log('✅ Показано сообщение "Спасибо"');
}

// Глобальная переменная для хранения данных калькулятора
let calculatorData = {};

// Функция для сохранения данных калькулятора
function saveCalculatorData(selectedSpecialties, employeeCount) {
    calculatorData = {
        selectedSpecialties: selectedSpecialties,
        employeeCount: employeeCount,
        timestamp: new Date().toISOString()
    };
    console.log('💾 Данные калькулятора сохранены:', calculatorData);
}

// Обновленная функция handleFormSubmit
function handleFormSubmit(form) {
    // console.log(`📝 Обработка формы: ${form.getAttribute('name')}`);
    
    // Собираем все поля для валидации
    const allFieldsToValidate = getFormFields(form);
    
    // Сначала скрываем все ошибки
    hideAllErrors(form);
    
    // Валидируем все поля
    const validationResult = validateAllFields(allFieldsToValidate);
    
    if (!validationResult.isValid) {
        // Показываем все ошибки
        showAllErrors(validationResult.errorFields);
        
        // Фокусируемся на первом поле с ошибкой
        if (validationResult.firstErrorField) {
            validationResult.firstErrorField.focus();
        }
        
        console.log(`❌ Валидация не пройдена. Ошибок: ${validationResult.errorFields.length}`);
        return false;
    }
    
    // console.log('✅ Все поля валидны!');
    
    // Собираем данные формы
    const formData = {};
    allFieldsToValidate.forEach(field => {
        const fieldName = field.getAttribute('name') || field.getAttribute('type');
        const fieldValue = field.value.trim();
        formData[fieldName] = fieldValue;
    });
    
    // Объединяем данные калькулятора и формы
    const combinedData = {
        ...calculatorData,
        ...formData,
        formType: form.getAttribute('name'),
        submittedAt: new Date().toISOString()
    };
    
    console.log('📊 Данные:', combinedData);
    
    // Делаем кнопку неактивной
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
    }
    
    // Имитация отправки на сервер
    setTimeout(() => {
        // Показываем сообщение об успехе
        showSuccessMessage(form);
    }, 1000);
    
    return true;
}

// Получаем все поля формы для валидации
function getFormFields(form) {
    const fields = [];
    
    // Обязательные поля
    const requiredFields = form.querySelectorAll('[required]');
    fields.push(...requiredFields);
    
    // Специальные поля
    const specialFields = form.querySelectorAll(
        'input[name="user_phone"], input[name="user_email"], input[name="user_name"], textarea[name="user_message"]'
    );
    
    specialFields.forEach(field => {
        if (!fields.includes(field)) {
            fields.push(field);
        }
    });
    
    // console.log(`📋 Найдено полей для валидации: ${fields.length}`);
    return fields;
}

// Скрываем все ошибки в форме
function hideAllErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.classList.remove('show');
    });
    
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Валидируем все поля
function validateAllFields(fields) {
    let isValid = true;
    let firstErrorField = null;
    const errorFields = [];
    
    fields.forEach(field => {
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
        errorFields
    };
}

// Валидируем одно поле
function validateSingleField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Проверка обязательных полей
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, getRequiredFieldMessage(fieldName));
        return false;
    }
    
    // Специфичная валидация для разных типов полей
    if (value) {
        if (fieldName === 'user_name') {
            return validateNameField(field);
        } else if (fieldName === 'user_email') {
            return validateEmailField(field);
        } else if (fieldName === 'user_phone') {
            return validatePhoneField(field);
        } else if (fieldName === 'user_message') {
            return validateMessageField(field);
        }
    }
    
    // Если поле не обязательно и пустое - валидно
    if (!field.hasAttribute('required') && !value) {
        hideFieldError(field);
        return true;
    }
    
    hideFieldError(field);
    return true;
}

// Получаем сообщение для обязательного поля
function getRequiredFieldMessage(fieldName) {
    const messages = {
        'user_name': 'Укажите имя',
        'user_phone': 'Укажите телефон',
        'user_email': 'Укажите email',
        'user_message': 'Заполните сообщение'
    };
    
    return messages[fieldName] || 'Заполните это поле';
}

// Валидация имени
function validateNameField(field) {
    const value = field.value.trim();
    
    if (value.length < 2) {
        showFieldError(field, 'Имя должно содержать минимум 2 символа');
        return false;
    }
    
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
    if (!nameRegex.test(value)) {
        showFieldError(field, 'Имя может содержать только буквы, пробелы и дефисы');
        return false;
    }
    
    hideFieldError(field);
    return true;
}

// Валидация email
function validateEmailField(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
        showFieldError(field, 'Укажите email');
        return false;
    }
    
    hideFieldError(field);
    return true;
}

// Валидация телефона
function validatePhoneField(field) {
    const value = field.value.replace(/\D/g, '');
    const cleanValue = value.replace(/^(\+7|7|8)/, '');
    
    if (cleanValue.length < 10) {
        const remainingDigits = 10 - cleanValue.length;
        showFieldError(field, `Ещё ${remainingDigits} ${getDigitWord(remainingDigits)}`);
        return false;
    }
    
    hideFieldError(field);
    return true;
}

// Валидация сообщения
function validateMessageField(field) {
    const value = field.value.trim();
    
    if (value.length < 10) {
        showFieldError(field, 'Сообщение должно содержать минимум 10 символов');
        return false;
    }
    
    hideFieldError(field);
    return true;
}

// Показываем ошибку для поля
function showFieldError(field, message) {
    let wrapper = field.closest('.input-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);
    }
    
    let errorElement = wrapper.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        wrapper.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${message}
    `;
    
    errorElement.classList.add('show');
    wrapper.classList.add('has-error');
    field.classList.add('error');
}

// Скрываем ошибку поля
function hideFieldError(field) {
    const wrapper = field.closest('.input-wrapper');
    if (!wrapper) return;
    
    const errorElement = wrapper.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    
    wrapper.classList.remove('has-error');
    field.classList.remove('error');
}

// Показываем все ошибки
function showAllErrors(errorFields) {
    // console.log(`❌ Показываем ${errorFields.length} ошибок:`);
    errorFields.forEach((field, index) => {
        // console.log(`  ${index + 1}. ${field.getAttribute('name')}: "${field.value}"`);
    });
}

function showSuccessMessage(form) {
    // console.log('🎉 Форма успешно отправлена!');
    
    const originalFormHTML = form.innerHTML;
    const isPopup = form.closest('.popup');
    
    // Простое сообщение "Спасибо"
    const successHTML = `
        <div class="success-message" style="text-align: center; padding: 40px 20px;">
            <div style="margin-bottom: 30px;">
               
                <h2 style="font-size: 28px; margin-bottom: 15px; color: #1c1c1c;">
                    Спасибо за заявку!
                </h2>
                <p style="font-size: 18px; color: #666; margin-bottom: 30px;">
                    Мы свяжемся с вами в ближайшее время
                </p>
                ${!isPopup ? '<button class="btn btn_red" onclick="resetForm(this.closest(\'form\'))" style="margin-top: 20px;">Отправить еще одну заявку</button>' : ''}
            </div>
        </div>
    `;
    
    // Заменяем содержимое
    form.innerHTML = successHTML;
    form.classList.add('success-state');
    form.setAttribute('data-original-html', originalFormHTML);
    
    // Для попапов - закрываем через 3 секунды
    if (isPopup) {
        setTimeout(() => {
            const popup = form.closest('.popup');
            popup.style.display = 'none';
            document.querySelector('.shadow').style.display = 'none';
            resetForm(form);
        }, 3000);
    }
}
// Вспомогательные функции
function getDigitWord(count) {
    if (count === 1) return 'цифра';
    if (count >= 2 && count <= 4) return 'цифры';
    return 'цифр';
}

// Инициализация кнопок отправки
function initSubmitButtons() {
    const buttons = [
        'input[type="submit"][value="Получить коммерческое предложение"][data-context="commercial-form"]',
        'input[type="submit"][value="Задать вопрос"][data-context="question-form"]',
        'input[type="submit"][id="submit_btn"][data-context="popup"]'
    ];
    
    buttons.forEach(selector => {
        const button = document.querySelector(selector);
        if (button) {
            const form = button.closest('form');
            if (form) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    // console.log(`🔘 Нажата кнопка: ${this.value}`);
                    handleFormSubmit(form);
                });
            }
        }
    });
}

// Инициализация всех форм
function initAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        initPhoneFields(form);
        initRealTimeValidation(form);
    });
}

// Инициализация специальных форм
function initSpecialForms() {
    const specialForms = ['form_0', 'form_1', 'form_2'];
    specialForms.forEach(formName => {
        const form = document.querySelector(`form[name="${formName}"]`) || 
                     document.querySelector('.popup.form form[name="form_2"]');
        if (form) {
            initPhoneFields(form);
            initRealTimeValidation(form);
        }
    });
}

// Инициализация масок телефона
function initPhoneFields(form) {
    const phoneInputs = form.querySelectorAll('input[name="user_phone"]');
    phoneInputs.forEach(phoneInput => {
        if (!phoneInput.value) {
            phoneInput.value = '+7 ';
        }
    });
}

// Валидация в реальном времени
function initRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
    });
}

function resetForm(form) {
    const originalHTML = form.getAttribute('data-original-html');
    if (originalHTML) {
        form.innerHTML = originalHTML;
        form.classList.remove('success-state');
        
        // Реинициализируем форму
        initPhoneFields(form);
        initRealTimeValidation(form);
        initSubmitButtons();
        
        // console.log('🔄 Форма сброшена для повторного использования');
    }
}