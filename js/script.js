/*
 * Форма с валидацией и маской телефона
 */
class FormHandler {
    constructor() {
        this.initPhoneMask();
        this.initFormValidation();
    }

    // Маска для телефона
    initPhoneMask() {
        const phoneInputs = document.querySelectorAll('input[name="user_phone"]');

        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');

                // Обработка 8, 7, +7
                if (value.startsWith('8')) {
                    value = '7' + value.substring(1);
                } else if (value.startsWith('7')) {
                    value = value;
                } else if (!value.startsWith('7')) {
                    value = '7' + value;
                }

                // Форматирование
                if (value.length > 1) {
                    value = '+7 ' + value.substring(1, 4) + ' ' + value.substring(4, 7) +
                        ' ' + value.substring(7, 9) + ' ' + value.substring(9, 11);
                }

                e.target.value = value;
            });

            // Валидация при отправке
            input.addEventListener('blur', (e) => {
                this.validatePhone(e.target);
            });
        });
    }

    validatePhone(input) {
        const value = input.value.replace(/\D/g, '');
        const isValid = value.length === 11 && value.startsWith('7');

        if (!isValid && input.value) {
            input.classList.add('error');
            this.showError(input, 'Укажите телефон');
        } else {
            input.classList.remove('error');
            this.hideError(input);
        }

        return isValid;
    }

    // Валидация форм
    initFormValidation() {
        const forms = document.querySelectorAll('form[name*="form_"]');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                if (this.validateForm(form)) {
                    this.sendForm(form);
                }
            });
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        // Сброс предыдущих ошибок
        this.clearFormErrors(form);

        requiredFields.forEach(field => {
            let fieldValid = true;

            if (!field.value.trim()) {
                fieldValid = false;
                this.showError(field, 'Это поле обязательно для заполнения');
            } else if (field.name === 'user_phone' && !this.validatePhone(field)) {
                fieldValid = false;
            } else if (field.type === 'email' && !this.validateEmail(field.value)) {
                fieldValid = false;
                this.showError(field, 'Введите корректный email');
            }

            if (!fieldValid) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(field, message) {
        // Удаляем старую ошибку
        this.hideError(field);

        // Создаем элемент ошибки
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" 
                      stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${message}
        `;

        field.parentNode.appendChild(errorElement);
        field.setAttribute('aria-invalid', 'true');
    }

    hideError(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        field.removeAttribute('aria-invalid');
    }

    clearFormErrors(form) {
        const errors = form.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());

        const fields = form.querySelectorAll('[aria-invalid]');
        fields.forEach(field => field.removeAttribute('aria-invalid'));
    }

    // Отправка формы
    async sendForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('[type="submit"]');

        // Добавляем formname если его нет
        if (!formData.get('formname')) {
            const formName = form.getAttribute('name') || 'unknown';
            formData.set('formname', formName);
        }

        // Блокируем кнопку
        this.disableSubmitButton(submitBtn, 'Отправка...');

        try {
            const response = await fetch('/mailto.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status) {
                // Успешная отправка
                console.log('форма отправлена', Object.fromEntries(formData));
                this.showSuccess(form);

                // Редирект или показ спасибо
                setTimeout(() => {
                    window.location.href = '/spasibo.html';
                }, 2000);
            } else {
                throw new Error(result.message || 'Ошибка сервера');
            }

        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            this.showError(form, 'Ошибка отправки. Попробуйте еще раз.');
            this.enableSubmitButton(submitBtn);
        }
    }

    disableSubmitButton(button, text = 'Отправка...') {
        button.disabled = true;
        button.setAttribute('data-original-text', button.value);
        button.value = text;
    }

    enableSubmitButton(button) {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text') || 'Отправить';
        button.value = originalText;
    }

    showSuccess(form) {
        // Можно добавить визуальное подтверждение
        form.classList.add('form-success');

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.textContent = 'Форма успешно отправлена!';
        successMessage.setAttribute('role', 'alert');

        form.appendChild(successMessage);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});

$(function(){
    // Делегируем обработку новому классу
    $("form[name*='form_']").off('submit').on('submit', function(e) {
        e.preventDefault();
        // Обработка будет в классе FormHandler
    });
});