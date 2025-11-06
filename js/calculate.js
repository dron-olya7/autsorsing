document.addEventListener("DOMContentLoaded", function () {
  const customSelect = document.getElementById("customSelect");
  const selectTrigger = customSelect.querySelector(".select-trigger");
  const selectDropdown = customSelect.querySelector(".select-dropdown");
  const selectOptions = selectDropdown.querySelectorAll(".select-option");
  const selectedItems = document.getElementById("selectedItems");
  const selectedDisplay = document.getElementById("selectedDisplay");
  const rangeSlider = document.getElementById("rangeSlider");
  const counterInput = document.getElementById("counterInput");
  const specialtySelect = document.getElementById("specialtySelect");
  const calculateBtn = document.querySelector(".calculate-btn.zakazat_pers");

  let selectedSpecialties = [];

  function updateButtonState() {
    if (selectedSpecialties.length === 0) {
      calculateBtn.disabled = true;
      calculateBtn.style.opacity = "0.6";
      calculateBtn.style.cursor = "not-allowed";
    } else {
      calculateBtn.disabled = false;
      calculateBtn.style.opacity = "1";
      calculateBtn.style.cursor = "pointer";
    }
  }

  selectTrigger.addEventListener("click", function () {
    customSelect.classList.toggle("active");
  });

  selectOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const value = this.getAttribute("data-value");

      if (!selectedSpecialties.includes(value)) {
        selectedSpecialties.push(value);
        updateSelectedDisplay();
        updateHiddenSelect();
        updateButtonState();
      }
    });
  });

  function removeSpecialty(value) {
    selectedSpecialties = selectedSpecialties.filter((item) => item !== value);
    updateSelectedDisplay();
    updateHiddenSelect();
    updateButtonState();
  }

  function updateSelectedDisplay() {
    selectedItems.innerHTML = "";

    selectOptions.forEach((option) => {
      const value = option.getAttribute("data-value");
      if (selectedSpecialties.includes(value)) {
        option.classList.add("selected");
      } else {
        option.classList.remove("selected");
      }
    });

    if (selectedSpecialties.length > 0) {
      selectTrigger.classList.add("has-selection");
      const placeholder = selectTrigger.querySelector(".select-placeholder");
      placeholder.textContent = `Выбрано: ${selectedSpecialties.length}`;
    } else {
      selectTrigger.classList.remove("has-selection");
      const placeholder = selectTrigger.querySelector(".select-placeholder");
      placeholder.textContent = "Выберите специальность";
    }

    if (selectedSpecialties.length > 0) {
      selectedDisplay.classList.add("active");

      selectedSpecialties.forEach((specialty) => {
        const item = document.createElement("div");
        item.className = "selected-item";
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
      selectedDisplay.classList.remove("active");
    }
  }

  function updateHiddenSelect() {
    Array.from(specialtySelect.options).forEach((option) => {
      option.selected = false;
    });

    selectedSpecialties.forEach((specialty) => {
      const option = Array.from(specialtySelect.options).find(
        (opt) => opt.value === specialty
      );
      if (option) option.selected = true;
    });
  }

  rangeSlider.addEventListener("input", function () {
    counterInput.value = this.value;
    updateRangeFill();
  });

  counterInput.addEventListener("input", function () {
    let value = parseInt(this.value) || 0;

    if (value < 0) value = 0;
    if (value > 500) value = 500;

    this.value = value;
    rangeSlider.value = value;
    updateRangeFill();
  });

  function updateRangeFill() {
    const value = rangeSlider.value;
    const min = rangeSlider.min;
    const max = rangeSlider.max;
    const fill = ((value - min) / (max - min)) * 100 + "%";
    rangeSlider.style.setProperty("--fill", fill);
  }

  updateRangeFill();

  window.removeSpecialty = removeSpecialty;

  if (calculateBtn) {
    calculateBtn.addEventListener("click", function () {
      if (selectedSpecialties.length === 0) {
        alert("Пожалуйста, выберите хотя бы одну специальность");
        return;
      }

      const formData = {
        specialties: selectedSpecialties,
        employeesCount: parseInt(counterInput.value),
      };

      if (typeof savePodborData === "function") {
        savePodborData(selectedSpecialties, parseInt(counterInput.value));
      }

      const popup =
        document.querySelector(".popup.form") ||
        document.getElementById("popup") ||
        document.querySelector(".popup");

      if (popup && typeof openPopup === "function") {
        openPopup(popup);
      }
    });

    updateButtonState();
  }
});

document.addEventListener("click", function (e) {
  const customSelect = document.getElementById("customSelect");
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("active");
  }
});
