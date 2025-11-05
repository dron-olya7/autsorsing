document.addEventListener('DOMContentLoaded', function() {
  // Элементы
  const customSelect = document.getElementById('customSelect');
  const selectTrigger = customSelect.querySelector('.select-trigger');
  const selectDropdown = customSelect.querySelector('.select-dropdown');
  const selectOptions = selectDropdown.querySelectorAll('.select-option');
  const selectedItems = document.getElementById('selectedItems');
  const selectedDisplay = document.getElementById('selectedDisplay');
  const rangeSlider = document.getElementById('rangeSlider');
  const counterInput = document.getElementById('counterInput');
  const specialtySelect = document.getElementById('specialtySelect');

  // Выбранные специальности
  let selectedSpecialties = [];

  // Открытие/закрытие селекта
  selectTrigger.addEventListener('click', function() {
    customSelect.classList.toggle('active');
  });

  // Выбор опции
  selectOptions.forEach(option => {
    option.addEventListener('click', function() {
      const value = this.getAttribute('data-value');
      
      if (!selectedSpecialties.includes(value)) {
        selectedSpecialties.push(value);
        updateSelectedDisplay();
        updateHiddenSelect();
      }
      
      customSelect.classList.remove('active');
    });
  });

  // Удаление выбранной специальности
  function removeSpecialty(value) {
    selectedSpecialties = selectedSpecialties.filter(item => item !== value);
    updateSelectedDisplay();
    updateHiddenSelect();
  }

  // Обновление отображения выбранных специальностей
  function updateSelectedDisplay() {
    selectedItems.innerHTML = '';
    
    // Обновляем отметки в выпадающем списке
    selectOptions.forEach(option => {
      const value = option.getAttribute('data-value');
      if (selectedSpecialties.includes(value)) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    // Обновляем плейсхолдер
    if (selectedSpecialties.length > 0) {
      selectTrigger.classList.add('has-selection');
      const placeholder = selectTrigger.querySelector('.select-placeholder');
      placeholder.textContent = `Выбрано: ${selectedSpecialties.length}`;
    } else {
      selectTrigger.classList.remove('has-selection');
      const placeholder = selectTrigger.querySelector('.select-placeholder');
      placeholder.textContent = 'Выберите специальность';
    }
    
    // Показываем выбранные элементы
    if (selectedSpecialties.length > 0) {
      selectedDisplay.classList.add('active');
      
      selectedSpecialties.forEach(specialty => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
          ${specialty}
          <span class="remove-btn" onclick="removeSpecialty('${specialty}')">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M0.75 12.75L12.75 0.750001M0.75 0.75L12.75 12.75" stroke="white" stroke-width="1.5"/>
            </svg>
          </span>
        `;
        selectedItems.appendChild(item);
      });
    } else {
      selectedDisplay.classList.remove('active');
    }
  }

  // Обновление скрытого select
  function updateHiddenSelect() {
    // Очищаем выбранные значения
    Array.from(specialtySelect.options).forEach(option => {
      option.selected = false;
    });
    
    // Устанавливаем выбранные значения
    selectedSpecialties.forEach(specialty => {
      const option = Array.from(specialtySelect.options).find(opt => opt.value === specialty);
      if (option) option.selected = true;
    });
  }

  // Связь range и input
  rangeSlider.addEventListener('input', function() {
    counterInput.value = this.value;
    updateRangeFill();
  });

  counterInput.addEventListener('input', function() {
    let value = parseInt(this.value) || 0;
    
    // Ограничиваем значения
    if (value < 0) value = 0;
    if (value > 500) value = 500;
    
    this.value = value;
    rangeSlider.value = value;
    updateRangeFill();
  });

  // Обновление заполнения range
  function updateRangeFill() {
    const value = rangeSlider.value;
    const min = rangeSlider.min;
    const max = rangeSlider.max;
    const fill = ((value - min) / (max - min)) * 100 + '%';
    rangeSlider.style.setProperty('--fill', fill);
  }

  // Инициализация
  updateRangeFill();

  // Глобальная функция для удаления
  window.removeSpecialty = removeSpecialty;

  // Обработчик для кнопки
  const calculateBtn = document.querySelector('.calculate-btn.zakazat_pers');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      // Создаем объект с данными
      const formData = {
        specialties: selectedSpecialties,
        employeesCount: parseInt(counterInput.value)
      };
      
      // Выводим объектом как вы хотели
      // console.log([formData.specialties, formData.employeesCount]);
      
      // Или в более читаемом виде:
      console.log('Данные формы:', formData);
    });
  }
});

// Закрытие селекта при клике вне его
document.addEventListener('click', function(e) {
  const customSelect = document.getElementById('customSelect');
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove('active');
  }
});