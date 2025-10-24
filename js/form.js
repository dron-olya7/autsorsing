document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('user_phone');
    const phoneError = document.getElementById('phone-error');
    const inputWrapper = document.querySelector('.input-wrapper');
    const form = document.forms.form_2;

    console.log('Elements loaded:', { phoneInput, phoneError, inputWrapper, form });

    // Функция показа ошибки
    function showError(message) {
        console.log('Showing error:', message);
        phoneError.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 6.75V9.5625M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM9 11.8125H9.00563V11.8181H9V11.8125Z" stroke="#E11D48" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${message}
        `;
        phoneError.classList.add('show');
        inputWrapper.classList.add('has-error');
    }

    // Функция скрытия ошибки
    function hideError() {
        console.log('Hiding error');
        phoneError.classList.remove('show');
        inputWrapper.classList.remove('has-error');
    }

    // Проверка телефона
    function validatePhone() {
        const value = phoneInput.value.replace(/\D/g, '');
        console.log('Validating phone:', value);
        
        hideError();
        
        if (!value) {
            showError('Укажите телефон');
            return false;
        }
        
        if (value.length < 11) {
            showError(`Ещё ${11 - value.length} цифр`);
            return false;
        }
        
        return true;
    }

    // Проверка в реальном времени
    phoneInput.addEventListener('input', function() {
        console.log('Input event:', this.value);
        this.value = this.value.replace(/\D/g, '');
        validatePhone();
    });

    // При фокусе проверяем
    phoneInput.addEventListener('focus', function() {
        console.log('Focus event');
        validatePhone();
    });

    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submit');
        
        if (!validatePhone()) {
            phoneInput.focus();
            return false;
        }
        
        console.log('Form is valid, sending...');
        aSend_order('form_2');
    });

    // Фикс кнопки
    setInterval(() => {
        const btn = document.getElementById('submit_btn');
        if (btn && btn.value !== 'Получить чек-листы') {
            btn.value = 'Получить чек-листы';
        }
    }, 100);
});

document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('user_phone');
    const phoneError = document.getElementById('phone-error');
    const form = document.forms.form_2;

    // Форматирование телефона
    function formatPhone(phone) {
        return phone.replace(/\D/g, '')
                   .replace(/(\d{1})?(\d{0,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})/, function(_, p1, p2, p3, p4, p5) {
                       let result = '';
                       if (p1) result = p1;
                       if (p2) result += ' ' + p2;
                       if (p3) result += ' ' + p3;
                       if (p4) result += ' ' + p4;
                       if (p5) result += '-' + p5;
                       return result.trim();
                   });
    }

    phoneInput.addEventListener('input', function() {
        // Сохраняем позицию курсора
        const cursor = this.selectionStart;
        const oldLength = this.value.length;
        
        // Форматируем
        this.value = formatPhone(this.value);
        
        // Восстанавливаем курсор
        const newLength = this.value.length;
        const diff = newLength - oldLength;
        this.setSelectionRange(cursor + diff, cursor + diff);
        
        // Проверяем валидность
        const digits = this.value.replace(/\D/g, '');
        phoneError.style.display = digits.length >= 10 ? 'none' : 'flex';
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const digits = phoneInput.value.replace(/\D/g, '');
        
        if (digits.length < 10) {
            phoneError.style.display = 'flex';
            phoneInput.focus();
            return false;
        }
        
        // Отправляем только цифры
        phoneInput.value = digits;
        aSend_order('form_2');
    });

    // Фикс кнопки
    setInterval(() => {
        const btn = document.getElementById('submit_btn');
        if (btn && btn.value !== 'Получить чек-листы') {
            btn.value = 'Получить чек-листы';
        }
    }, 100);
});