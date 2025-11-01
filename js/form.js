// Универсальный обработчик форм
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех форм на странице
    initAllForms();

    // Инициализация слайдера отзывов
    initReviewsSlider();

    // Инициализация специальных форм
    initSpecialForms();
});

// Инициализация специальных форм с дополнительными полями
function initSpecialForms() {
    // Форма form_0 (коммерческое предложение)
    const form0 = document.querySelector('form[name="form_0"]');
    if (form0) {
        initPhoneFields(form0);
        initRealTimeValidation(form0);

        // Валидация поля имени
        const nameInput = form0.querySelector('input[name="user_name"]');
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                validateNameField(this);
            });
        }

        form0.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }

    // Форма form_1 (задать вопрос)
    const form1 = document.querySelector('form[name="form_1"]');
    if (form1) {
        initPhoneFields(form1);
        initRealTimeValidation(form1);

        // Валидация поля имени
        const nameInput = form1.querySelector('input[name="user_name"]');
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                validateNameField(this);
            });
        }

        // Дополнительная валидация для email
        const emailInput = form1.querySelector('input[name="user_email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmailField(this);
            });
        }

        // Для textarea только отслеживаем заполненность без вывода ошибок
        const messageTextarea = form1.querySelector('textarea[name="user_message"]');
        if (messageTextarea) {
            messageTextarea.addEventListener('blur', function() {
                // Только проверяем заполненность, ошибку не показываем
                if (!this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        }

        form1.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }

    // Форма в попапе (form_2)
    const form2 = document.querySelector('.popup.form form[name="form_2"]');
    if (form2) {
        initPhoneFields(form2);
        initRealTimeValidation(form2);

        // Специальная валидация для чекбоксов способов связи
        const contactCheckboxes = form2.querySelectorAll('input[name="contact_method"]');
        contactCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                validateContactMethods(form2);
            });
        });

        form2.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }
}

// Улучшенная валидация поля имени
function validateNameField(nameInput) {
    const value = nameInput.value.trim();

    // Сбрасываем ошибку
    hideFieldError(nameInput);

    // Проверяем валидность
    if (!value) {
        showFieldError(nameInput, 'Укажите имя');
        return false;
    }

    // Проверяем минимальную длину имени (2 символа)
    if (value.length < 2) {
        showFieldError(nameInput, 'Имя должно содержать минимум 2 символа');
        return false;
    }

    // Проверяем формат имени (только буквы, пробелы и дефисы)
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
    if (!nameRegex.test(value)) {
        showFieldError(nameInput, 'Имя может содержать только буквы, пробелы и дефисы');
        return false;
    }

    return true;
}

// Улучшенная валидация поля email
function validateEmailField(emailInput) {
    const value = emailInput.value.trim();

    // Сбрасываем ошибку
    hideFieldError(emailInput);

    // Проверяем валидность
    if (!value) {
        showFieldError(emailInput, 'Укажите email');
        return false;
    }

    // Проверяем формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showFieldError(emailInput, 'Укажите корректный email адрес');
        return false;
    }

    return true;
}

// Улучшенная валидация телефонного поля
function validatePhoneField(phoneInput) {
    const value = phoneInput.value.replace(/\D/g, '');
    const cleanValue = value.replace(/^(\+7|7|8)/, '');

    // Сбрасываем ошибку
    hideFieldError(phoneInput);

    // Проверяем валидность
    if (!cleanValue) {
        showFieldError(phoneInput, 'Укажите телефон');
        return false;
    }

    if (cleanValue.length < 10) {
        const remainingDigits = 10 - cleanValue.length;
        showFieldError(phoneInput, `Ещё ${remainingDigits} ${getDigitWord(remainingDigits)}`);
        return false;
    }

    return true;
}

// Функция для правильного склонения слова "цифра"
function getDigitWord(count) {
    if (count === 1) return 'цифра';
    if (count >= 2 && count <= 4) return 'цифры';
    return 'цифр';
}

// Улучшенная функция показа ошибки поля
function showFieldError(field, message) {
    // Находим или создаем обертку
    let wrapper = field.closest('.input-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);
    }

    // Создаем или находим элемент ошибки
    let errorElement = wrapper.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        wrapper.appendChild(errorElement);
    }

    // Устанавливаем сообщение об ошибке
    errorElement.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${message}
    `;

    // Показываем ошибку
    errorElement.classList.add('show');
    wrapper.classList.add('has-error');
    field.classList.add('error');

    // Добавляем aria-attributes для доступности
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorElement.id || (errorElement.id = 'error-' + Date.now()));
}

// Функция скрытия ошибки поля
function hideFieldError(field) {
    const wrapper = field.closest('.input-wrapper');
    if (!wrapper) return;

    const errorElement = wrapper.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }

    wrapper.classList.remove('has-error');
    field.classList.remove('error');

    // Убираем aria-attributes
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

// Улучшенная валидация в реальном времени
function initRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], input[name="user_phone"], input[name="user_email"], input[name="user_name"]');

    inputs.forEach(input => {
        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Сброс ошибки при вводе
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                hideFieldError(this);

                // Специфичная валидация при вводе для телефона
                if (this.name === 'user_phone') {
                    validatePhoneField(this);
                }
            }
        });

        // Валидация при изменении (для чекбоксов)
        input.addEventListener('change', function() {
            if (this.type === 'checkbox' || this.type === 'radio') {
                validateField(this);
            }
        });
    });
}

// Улучшенная функция валидации поля (общая)
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    const fieldType = field.type;

    // Сбрасываем ошибку
    hideFieldError(field);

    // Проверяем обязательность поля
    if (field.hasAttribute('required') && !value) {
        let errorMessage = 'Заполните это поле';

        // Специфичные сообщения для разных типов полей
        if (fieldName === 'user_name') {
            errorMessage = 'Укажите имя';
        } else if (fieldName === 'user_email') {
            errorMessage = 'Укажите email';
        } else if (fieldName === 'user_phone') {
            errorMessage = 'Укажите телефон';
        } else if (fieldName === 'user_message') {
            // Для textarea не показываем ошибку, только добавляем класс
            field.classList.add('error');
            return false;
        }

        showFieldError(field, errorMessage);
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
            // Для textarea достаточно проверки на заполненность
            if (value.length < 10) {
                showFieldError(field, 'Сообщение должно содержать минимум 10 символов');
                return false;
            }
            field.classList.remove('error');
            return true;
        }
    }

    // Валидация чекбоксов
    if (fieldType === 'checkbox' && field.hasAttribute('required')) {
        if (!field.checked) {
            showFieldError(field, 'Это поле обязательно для выбора');
            return false;
        }
    }

    return true;
}

// Улучшенная валидация чекбоксов способов связи
function validateContactMethods(form) {
    const contactCheckboxes = form.querySelectorAll('input[name="contact_method"]');
    const checkedMethods = Array.from(contactCheckboxes).filter(cb => cb.checked);

    const socialContainer = form.querySelector('.form_social');
    let isValid = true;

    if (checkedMethods.length === 0) {
        if (socialContainer) {
            socialContainer.style.border = '1px solid #E11D48';
            socialContainer.style.borderRadius = '8px';
            socialContainer.style.padding = '10px';
        }
        isValid = false;
    } else {
        if (socialContainer) {
            socialContainer.style.border = '';
            socialContainer.style.padding = '';
        }
        isValid = true;
    }

    // Показываем/скрываем общее сообщение об ошибке
    const generalError = form.querySelector('.contact-methods-error');
    if (!isValid) {
        if (!generalError) {
            const errorElement = document.createElement('div');
            errorElement.className = 'contact-methods-error error-message';
            errorElement.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Выберите хотя бы один способ связи
            `;
            if (socialContainer) {
                socialContainer.parentNode.insertBefore(errorElement, socialContainer.nextSibling);
            }
        } else {
            generalError.classList.add('show');
        }
    } else {
        if (generalError) {
            generalError.classList.remove('show');
        }
    }

    return isValid;
}

// Инициализация отслеживания кликов по кнопкам с профессиями
function initProfessionButtons() {
    const professionButtons = document.querySelectorAll('[data-profession]');
    professionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const profession = this.getAttribute('data-profession');
            const context = this.getAttribute('data-context');
            const action = this.getAttribute('data-action');

            console.log(`📌 Сохранена профессия: ${profession}, контекст: ${context}`);

            // Сохраняем данные о последней нажатой кнопке профессии
            window.lastClickedProfession = {
                profession: profession,
                context: context,
                action: action,
                timestamp: new Date().toISOString(),
                element: this
            };
        });
    });
}

// Маска телефона
function initPhoneFields(form) {
    const phoneInputs = form.querySelectorAll('input[name="user_phone"]');

    phoneInputs.forEach(phoneInput => {
        // При фокусе - показываем маску если пусто
        phoneInput.addEventListener('focus', function() {
            if (!this.value.replace(/\D/g, '')) {
                this.value = '+7 ';
            }
        });

        // Обработчик ввода
        phoneInput.addEventListener('input', function(e) {
            const cursor = this.selectionStart;
            const oldValue = this.value;

            // Применяем маску
            this.value = formatPhone(this.value);

            // Восстанавливаем позицию курсора
            const newValue = this.value;
            if (oldValue.length < newValue.length) {
                this.setSelectionRange(cursor + 1, cursor + 1);
            } else {
                this.setSelectionRange(cursor, cursor);
            }

            // Валидация
            validatePhoneField(this);
        });

        // При потере фокуса
        phoneInput.addEventListener('blur', function() {
            const digits = this.value.replace(/\D/g, '').replace(/^(\+7|7|8)/, '');
            if (digits.length === 0) {
                this.value = '';
            }
        });

        // Инициализация при загрузке
        if (!phoneInput.value) {
            phoneInput.value = '+7 ';
        }
    });
}

// Форматирование телефона
function formatPhone(phone) {
    let digits = phone.replace(/\D/g, '');

    // Удаляем 8, +7, 7 в начале
    if (digits.startsWith('8') || digits.startsWith('7')) {
        digits = digits.substring(1);
    } else if (digits.startsWith('+7')) {
        digits = digits.substring(2);
    }

    // Ограничиваем длину
    digits = digits.substring(0, 10);

    // Форматируем
    let formatted = '+7 ';
    if (digits.length > 0) {
        formatted += digits.substring(0, 3);
    }
    if (digits.length > 3) {
        formatted += ' ' + digits.substring(3, 6);
    }
    if (digits.length > 6) {
        formatted += '-' + digits.substring(6, 8);
    }
    if (digits.length > 8) {
        formatted += '-' + digits.substring(8, 10);
    }

    return formatted;
}

// Улучшенная функция инициализации всех форм
function initAllForms() {
    // Находим все формы на странице
    const forms = document.querySelectorAll('form');

    forms.forEach((form, index) => {
        const formName = form.getAttribute('name') || `form_${index}`;

        // Пропускаем формы, которые уже обрабатываются в initSpecialForms
        if (formName === 'form_0' || formName === 'form_1' || formName === 'form_2') {
            return;
        }

        console.log(`Инициализация формы: ${formName}`);

        // Добавляем скрытое поле formname если его нет
        if (!form.querySelector('input[name="formname"]')) {
            const formNameInput = document.createElement('input');
            formNameInput.type = 'hidden';
            formNameInput.name = 'formname';
            formNameInput.value = formName;
            form.appendChild(formNameInput);
        }

        // Инициализируем маски и валидацию для телефонов
        initPhoneFields(form);

        // Обработчик отправки формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });

        // Валидация в реальном времени
        initRealTimeValidation(form);
    });

    // Инициализация кнопок вызова форм через data-атрибуты
    initFormTriggers();

    // Инициализация отслеживания кликов по кнопкам с профессиями
    initProfessionButtons();
}

// Инициализация триггеров открытия форм через data-атрибуты
function initFormTriggers() {
    const triggers = document.querySelectorAll('[data-action]');

    triggers.forEach(trigger => {
        // ИСКЛЮЧАЕМ: определенные data-action атрибуты
        const excludedActions = [
            'next',
            'prev',
            'more-reviews',
            'ask-question',
            'whatsapp-contact',
            'read-article',
            'get-commercial-offer'
        ];

        const action = trigger.getAttribute('data-action');

        // Пропускаем кнопки с исключенными действиями
        if (excludedActions.includes(action)) {
            return;
        }

        // Сохраняем оригинальные значения кнопок
        if (trigger.type === 'submit' || trigger.getAttribute('type') === 'submit') {
            if (trigger.value) {
                trigger.setAttribute('data-original-value', trigger.value);
            } else {
                trigger.setAttribute('data-original-text', trigger.textContent);
            }
        }

        trigger.addEventListener('click', function(e) {
            if (this.tagName === 'A') {
                e.preventDefault();
            }

            const action = this.getAttribute('data-action');
            const context = this.getAttribute('data-context');
            const formName = this.getAttribute('data-form-name');
            const profession = this.getAttribute('data-profession');

            console.log(`🎯 Триггер: ${action}, контекст: ${context}, форма: ${formName}, профессия: ${profession}`);

            // Сохраняем данные о профессии в новом формате
            if (profession) {
                window.lastClickedProfession = {
                    profession: profession,
                    context: context,
                    action: action,
                    timestamp: new Date().toISOString(),
                    element: this
                };
                console.log(`💾 Сохранена профессия: ${profession}`);
            }

            // Здесь можно добавить логику открытия конкретной формы
            // с настройками из data-атрибутов

            // Пример открытия стандартной формы
            openStandardForm(this);
        });
    });
}

// Открытие стандартной формы с настройками
function openStandardForm(trigger) {
    const form = document.querySelector('.popup.form');
    if (!form) return;

    // Настройка формы из data-атрибутов
    const title = trigger.getAttribute('data-title');
    const subtitle = trigger.getAttribute('data-subtitle');
    const fields = trigger.getAttribute('data-fields');
    const formName = trigger.getAttribute('data-form-name');
    const profession = trigger.getAttribute('data-profession');

    if (title) {
        const titleElement = form.querySelector('.form_title');
        if (titleElement) titleElement.textContent = title;
    }

    if (subtitle) {
        const subtitleElement = form.querySelector('.form_desc');
        if (subtitleElement) subtitleElement.textContent = subtitle;
    }

    // Установка formname
    if (formName) {
        let formNameInput = form.querySelector('input[name="formname"]');
        if (!formNameInput) {
            formNameInput = document.createElement('input');
            formNameInput.type = 'hidden';
            formNameInput.name = 'formname';
            form.appendChild(formNameInput);
        }
        formNameInput.value = formName;
    }

    // Настройка кнопки отправки
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
        // Восстанавливаем оригинальное значение из data-атрибута
        const originalValue = submitBtn.getAttribute('data-original-value');
        if (originalValue) {
            submitBtn.value = originalValue;
        }

        // Устанавливаем правильные data-атрибуты
        submitBtn.setAttribute('data-action', 'submit-form');
        submitBtn.setAttribute('data-context', 'popup');
        submitBtn.setAttribute('data-form-purpose', 'get-checklists');
    }

    // Передача профессии в попап
    if (profession) {
        // Сохраняем профессию для использования при отправке формы
        form.setAttribute('data-current-profession', profession);

        // Обновляем поле user_hepl
        const userHelpInput = form.querySelector('.user_hepl');
        if (userHelpInput) {
            userHelpInput.value = profession;
        }

        console.log(`📌 Профессия передана в попап: ${profession}`);
    }

    // Показываем форму
    form.style.display = 'block';
    document.querySelector('.shadow').style.display = 'block';
}

// Инициализация слайдера отзывов
function initReviewsSlider() {
    const reviewTriggers = document.querySelectorAll('.item_review, .review_image, .review_name, .review_company, .review_text');

    reviewTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Проверяем, не кликнули ли по навигационным стрелкам
            if (e.target.closest('.js-rotateslider-arrow') ||
                e.target.closest('.arrow') ||
                e.target.closest('[data-action="next"]') ||
                e.target.closest('[data-action="prev"]')) {
                return;
            }

            // // Открываем попап при клике на отзыв
            // openReviewForm();
        });
    });
}

// Открытие формы при клике на отзыв
// function openReviewForm() {
//     const form = document.querySelector('.popup.form');
//     if (!form) return;

//     // Настраиваем форму для отзывов
//     const titleElement = form.querySelector('.form_title');
//     const subtitleElement = form.querySelector('.form_desc');

//     if (titleElement) {
//         titleElement.textContent = 'Получите расчет с экономией 40%';
//     }

//     if (subtitleElement) {
//         subtitleElement.textContent = 'и сроками выхода на объект';
//     }

//     // Устанавливаем formname
//     let formNameInput = form.querySelector('input[name="formname"]');
//     if (!formNameInput) {
//         formNameInput = document.createElement('input');
//         formNameInput.type = 'hidden';
//         formNameInput.name = 'formname';
//         form.appendChild(formNameInput);
//     }
//     formNameInput.value = 'review_click_form';

//     // Показываем форму
//     form.style.display = 'block';
//     document.querySelector('.shadow').style.display = 'block';
// }

// Функция показа общей ошибки формы
function showFormError(form, message) {
    let errorElement = form.querySelector('.form-general-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-general-error error-message';
        form.insertBefore(errorElement, form.firstChild);
    }

    errorElement.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${message}
    `;
    errorElement.classList.add('show');
}

// Функция скрытия общей ошибки формы
function hideFormError(form) {
    const errorElement = form.querySelector('.form-general-error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function handleFormSubmit(form) {
    console.log(`Отправка формы: ${form.getAttribute('name')}`);

    // Синхронизируем данные калькулятора перед валидацией
    syncCalculatorData();

    // Валидация всех полей
    let isValid = true;

    // Проверяем обязательные поля
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            // Фокусируемся на первой ошибке
            if (isValid) {
                field.focus();
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Специальная валидация для разных типов форм
    if (form.querySelector('input[name="contact_method"]')) {
        if (!validateContactMethods(form)) {
            isValid = false;
        }
    }

    // Дополнительная валидация для email в форме вопросов
    if (form.querySelector('input[name="user_email"]')) {
        const emailInput = form.querySelector('input[name="user_email"]');
        if (emailInput.value.trim() && !validateEmailField(emailInput)) {
            isValid = false;
        }
    }

    if (!isValid) {
        console.log('❌ Валидация формы не пройдена');
        return false;
    }

    // Скрываем общее сообщение об ошибке если оно есть
    hideFormError(form);

    // Подготавливаем телефон для отправки
    const phoneInput = form.querySelector('input[name="user_phone"]');
    let originalPhoneValue = '';
    if (phoneInput) {
        originalPhoneValue = phoneInput.value;
        const phoneDigits = '7' + originalPhoneValue.replace(/\D/g, '').replace(/^(\+7|7|8)/, '');

        // Создаем временное поле для чистого номера
        const tempInput = document.createElement('input');
        tempInput.type = 'hidden';
        tempInput.name = 'user_phone_clean';
        tempInput.value = phoneDigits;
        form.appendChild(tempInput);
    }

    // Делаем кнопку неактивной
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
        const originalValue = submitBtn.value || submitBtn.textContent;

        // Сохраняем оригинальное значение
        if (submitBtn.value) {
            submitBtn.setAttribute('data-original-value', originalValue);
            submitBtn.value = 'Отправляется...';
        } else {
            submitBtn.setAttribute('data-original-text', originalValue);
            submitBtn.textContent = 'Отправляется...';
        }
    }

    // Собираем ВСЕ данные в единый объект
    const allFormData = collectAllFormData(form);

    // Выводим ВСЕ данные в консоль
    console.log('=== ФОРМА ОТПРАВЛЕНА ===');
    console.log('Все данные формы:', allFormData);

    // Имитация отправки с быстрым показом "Спасибо"
    setTimeout(() => {
        // Успешная отправка
        console.log('✅ Форма успешно отправлена!');

        // Восстанавливаем оригинальное значение телефона
        if (phoneInput) {
            phoneInput.value = originalPhoneValue || '+7 ';
            const tempInput = form.querySelector('input[name="user_phone_clean"]');
            if (tempInput) form.removeChild(tempInput);
        }

        // НЕМЕДЛЕННО показываем сообщение "Спасибо"
        showSuccessMessage(form, allFormData);

    }, 800); // Уменьшаем задержку для более быстрого отклика

    return true;
}

// Синхронизация данных калькулятора перед отправкой формы
function syncCalculatorData() {
    try {
        // Обновляем глобальные переменные из calculate.js
        if (typeof window.selectedSpecialties !== 'undefined') {
            window.selectedSpecialties = window.selectedSpecialties || [];
        }

        // Логируем текущее состояние
        console.log('🔄 Синхронизация данных калькулятора:', {
            specialties: window.selectedSpecialties,
            employeeCount: document.getElementById('counterInput')?.value
        });

    } catch (e) {
        console.log('Ошибка синхронизации данных калькулятора:', e);
    }
}

// Сбор всех данных формы в единый объект
function collectAllFormData(form) {
    const formData = new FormData(form);
    const formObject = {};

    // Базовые данные формы
    for (let [key, value] of formData.entries()) {
        // Обработка массивов (например, чекбоксы)
        if (formObject[key]) {
            if (Array.isArray(formObject[key])) {
                formObject[key].push(value);
            } else {
                formObject[key] = [formObject[key], value];
            }
        } else {
            formObject[key] = value;
        }
    }

    // Добавляем дополнительные данные
    formObject.formName = form.getAttribute('name');
    formObject.timestamp = new Date().toISOString();

    // Получаем данные из калькулятора (если есть)
    const calculatorData = getActualCalculatorData();
    if (calculatorData && (calculatorData.specialties.length > 0 || calculatorData.employeeCount > 0)) {
        formObject.calculator = calculatorData;
    }

    // Используем новую функцию с приоритетом калькулятора
    const professionData = getProfessionDataWithCalculatorPriority();
    if (professionData) {
        formObject.profession = professionData;
    }

    // Добавляем контекст (из data-атрибутов кнопки)
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
        formObject.context = submitBtn.getAttribute('data-context');
        formObject.action = submitBtn.getAttribute('data-action');
        formObject.formPurpose = submitBtn.getAttribute('data-form-purpose');
    }

    return formObject;
}

// Новая функция для получения данных профессии с приоритетом калькулятора
function getProfessionDataWithCalculatorPriority() {
    try {
        // ПРИОРИТЕТ 1: Данные из калькулятора
        const calculatorData = getActualCalculatorData();
        if (calculatorData && calculatorData.specialties.length > 0) {
            return {
                selectedSpecialties: calculatorData.specialties, // МАССИВ выбранных специальностей
                employeeCount: calculatorData.employeeCount,
                context: 'calculator',
                action: 'get-calculation-with-saving',
                source: 'calculator_data',
                timestamp: calculatorData.timestamp
            };
        }

        // ПРИОРИТЕТ 2: Последняя нажатая кнопка профессии
        if (window.lastClickedProfession) {
            return {
                selectedSpecialties: [window.lastClickedProfession.profession], // Обернули в массив
                context: window.lastClickedProfession.context,
                action: window.lastClickedProfession.action,
                timestamp: window.lastClickedProfession.timestamp,
                source: 'last_clicked_button'
            };
        }

        // ПРИОРИТЕТ 3: Активная кнопка с профессией
        const activeButton = document.querySelector('.zakazat_pers[data-profession]');
        if (activeButton) {
            return {
                selectedSpecialties: [activeButton.getAttribute('data-profession')], // Обернули в массив
                context: activeButton.getAttribute('data-context'),
                action: activeButton.getAttribute('data-action'),
                source: 'active_button'
            };
        }

        // ПРИОРИТЕТ 4: Глобальная переменная
        if (window.currentProfession) {
            return {
                selectedSpecialties: [window.currentProfession], // Обернули в массив
                source: 'global_variable'
            };
        }

    } catch (e) {
        console.log('Ошибка получения данных профессии:', e);
    }
    return null;
}

// Получение актуальных данных калькулятора
function getActualCalculatorData() {
    try {
        // Пробуем получить данные из разных источников
        let specialties = [];
        let employeeCount = 0;

        // Источник 1: Глобальная переменная
        if (window.selectedSpecialties && window.selectedSpecialties.length > 0) {
            specialties = [...window.selectedSpecialties];
        }

        // Источник 2: DOM элементы (на случай если глобальная переменная не обновляется)
        if (specialties.length === 0) {
            const selectedItems = document.getElementById('selectedItems');
            if (selectedItems) {
                const items = selectedItems.querySelectorAll('.selected-item');
                specialties = Array.from(items).map(item =>
                    item.textContent.replace(/×/g, '').trim()
                );
            }
        }

        // Получаем количество сотрудников
        const counterInput = document.getElementById('counterInput');
        const rangeSlider = document.getElementById('rangeSlider');

        if (counterInput && counterInput.value) {
            employeeCount = parseInt(counterInput.value) || 0;
        } else if (rangeSlider && rangeSlider.value) {
            employeeCount = parseInt(rangeSlider.value) || 0;
        }

        return {
            specialties: specialties,
            employeeCount: employeeCount,
            timestamp: new Date().toISOString(),
            dataSource: specialties.length > 0 ? 'global_variable' : 'dom_elements'
        };

    } catch (e) {
        console.log('Ошибка получения данных калькулятора:', e);
        return { specialties: [], employeeCount: 0, timestamp: new Date().toISOString() };
    }
}

function showSuccessMessage(form, formData) {
    console.log('✅ Успешная отправка! Все данные:', formData);

    // Находим попап
    const popup = form.closest('.popup');

    if (popup) {
        // Для попапа используем оригинальную логику
        const profession = formData.profession?.selectedSpecialties?.[0] ||
            formData.user_hepl ||
            'специалиста';

        popup.innerHTML = `
            <span class="close_popup_form">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.274587 0.274587C0.640704 -0.0915292 1.2343 -0.0915292 1.60041 0.274587L8.4375 7.11167L15.2746 0.274588C15.6407 -0.0915281 16.2343 -0.0915281 16.6004 0.274588C16.9665 0.640705 16.9665 1.2343 16.6004 1.60041L9.76333 8.4375L16.6004 15.2746C16.9665 15.6407 16.9665 16.2343 16.6004 16.6004C16.2343 16.9665 15.6407 16.9665 15.2746 16.6004L8.4375 9.76333L1.60041 16.6004C1.2343 16.9665 0.640704 16.9665 0.274588 16.6004C-0.091529 16.2343 -0.091529 15.6407 0.274588 15.2746L7.11167 8.4375L0.274587 1.60041C-0.0915292 1.2343 -0.0915292 0.640704 0.274587 0.274587Z" fill="#8E8E8E"></path>
                </svg>
            </span>
            <div class="success-content" style="text-align: center; padding: 40px 20px;">
                <div style="margin-bottom: 30px;">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin-bottom: 20px;">
                        <circle cx="40" cy="40" r="40" fill="#4CAF50"/>
                        <path d="M30 40L37.5 47.5L50 32.5" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 class="form_title border_wave border_wave_long" style="font-size: 28px; margin-bottom: 15px;">
                        Спасибо за заявку!
                    </h2>          
                </div>           
            </div>
        `;

        // Добавляем обработчик закрытия для нового крестика
        const closeBtn = popup.querySelector('.close_popup_form');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                popup.style.display = 'none';
                document.querySelector('.shadow').style.display = 'none';
            });
        }

        console.log('🎉 Показано сообщение "спасибо" в попапе');
    } else {
        // Для обычных форм на странице (form_0, form_1) показываем сообщение "Спасибо" вместо формы
        const originalFormHTML = form.innerHTML;
        const formWrapper = form.parentNode;

        // Создаем HTML для сообщения "Спасибо"
        const successHTML = `
            <div class="success-message" style="text-align: center; padding: 40px 20px; border-radius: 12px; margin: 20px 0;">
                <div style="margin-bottom: 30px;">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin-bottom: 20px;">
                        <circle cx="40" cy="40" r="40" fill="#4CAF50"/>
                        <path d="M30 40L37.5 47.5L50 32.5" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 style="font-size: 28px; margin-bottom: 15px; color: #1c1c1c;">
                        Спасибо за заявку!
                    </h2>
                    <p style="font-size: 18px; color: #666; margin-bottom: 20px;">
                        Мы свяжемся с вами в ближайшее время
                    </p>
                </div>
            </div>
        `;

        // Заменяем содержимое формы на сообщение "Спасибо"
        form.innerHTML = successHTML;

        // Добавляем класс для стилизации
        form.classList.add('success-state');

        // Сохраняем оригинальный HTML в data-атрибут для возможности восстановления
        form.setAttribute('data-original-html', originalFormHTML);

        // Обработчик для кнопки "Отправить еще одну заявку"
        const resetBtn = form.querySelector('.reset-form-message');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // Восстанавливаем оригинальную форму
                const originalHTML = form.getAttribute('data-original-html');
                form.innerHTML = originalHTML;
                form.classList.remove('success-state');

                // Переинициализируем форму
                reinitializeForm(form);
            });
        }

        console.log('🎉 Показано сообщение "спасибо" для формы на странице');
    }
}

function reinitializeForm(form) {
    const formName = form.getAttribute('name');

    // Повторно инициализируем валидацию и обработчики
    initPhoneFields(form);
    initRealTimeValidation(form);

    // Добавляем обработчик отправки
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });

    // Специфичная инициализация для разных форм
    if (formName === 'form_0') {
        const nameInput = form.querySelector('input[name="user_name"]');
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                validateNameField(this);
            });
        }
    } else if (formName === 'form_1') {
        const nameInput = form.querySelector('input[name="user_name"]');
        const emailInput = form.querySelector('input[name="user_email"]');
        const messageTextarea = form.querySelector('textarea[name="user_message"]');

        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                validateNameField(this);
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmailField(this);
            });
        }

        if (messageTextarea) {
            messageTextarea.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        }
    }

    console.log('🔄 Форма переинициализирована:', formName);
}

// Функция для закрытия попапа (используется в кобке)
function closePopup() {
    const popup = document.querySelector('.popup.form');
    const shadow = document.querySelector('.shadow');

    if (popup) {
        popup.style.display = 'none';
    }
    if (shadow) {
        shadow.style.display = 'none';
    }
}

// Закрытие попапов
document.addEventListener('click', function(e) {
    // Закрытие формы по крестику
    if (e.target.closest('.close_popup_form') || e.target.closest('.close_popup')) {
        const popup = e.target.closest('.popup');
        if (popup) {
            popup.style.display = 'none';
            document.querySelector('.shadow').style.display = 'none';
        }
    }

    // Закрытие по клику на тень
    if (e.target.classList.contains('shadow')) {
        document.querySelectorAll('.popup').forEach(popup => {
            popup.style.display = 'none';
        });
        e.target.style.display = 'none';
    }
});

// Глобальная переменная для хранения данных калькулятора
window.selectedSpecialties = [];
window.currentProfession = null;
// Новая глобальная переменная для хранения последней нажатой профессии
window.lastClickedProfession = null;

// Интеграция с существующим jQuery кодом - удаляем конфликтующие обработчики
document.addEventListener('DOMContentLoaded', function() {
    // Удаляем конфликтующие обработчики из jQuery кода
    if (typeof $ !== 'undefined') {
        $(document).off('click', '.zakazat_pers');
        $(document).off('click', '.zakazat_zvonok');

        // Добавляем совместимые обработчики ТОЛЬКО для кнопок без data-action
        $(document).on('click', '.zakazat_pers:not([data-action])', function(){
            var pers = $(this).parent().parent().find('.title_podbor').text().trim();
            $('.popup.form .user_hepl').val(pers);
            $('.shadow').addClass('openedPopup');
            $('.popup.form').addClass('openedPopup');

            // НЕ меняем значение кнопки, оставляем "Получить чек-листы"
            const submitBtn = $('.popup.form input[type="submit"]');
            if (submitBtn.attr('data-original-value')) {
                submitBtn.val(submitBtn.attr('data-original-value'));
            }
        });

        $(document).on('click', '.zakazat_zvonok:not([data-action])', function(){
            $('.shadow').addClass('openedPopup');
            $('.popup.form').addClass('openedPopup');

            // Для звонка устанавливаем другое значение
            $('.popup.form input[type="submit"]').val('Получить коммерческое предложение');
        });
    }
});