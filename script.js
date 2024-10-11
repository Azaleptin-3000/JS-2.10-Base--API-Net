// Функция для загрузки пользователей
function loadUsers() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
            users.forEach(user => addUserToTable(user, usersTable));
        })
        .catch(error => {
            console.error('Ошибка при получении списка пользователей:', error);
        });
}

// Функция для добавления пользователя в таблицу
function addUserToTable(user, usersTable) {
    const row = usersTable.insertRow();

    const idCell = row.insertCell(0);
    const nameCell = row.insertCell(1);
    const emailCell = row.insertCell(2);
    const avatarCell = row.insertCell(3);
    const actionCell = row.insertCell(4);

    idCell.textContent = user.id;
    nameCell.textContent = user.name;
    emailCell.textContent = user.email;

    // Отображаем аватар, если он доступен
    if (user.avatar) {
        const avatarImg = document.createElement('img');
        avatarImg.src = user.avatar;
        avatarImg.alt = 'Avatar';
        avatarImg.style.width = '50px';  // Устанавливаем размеры изображения
        avatarImg.style.height = '50px';
        avatarCell.appendChild(avatarImg);
    } else {
        avatarCell.textContent = 'Аватар отсутствует';
    }

    // Создаем кнопки для действий (Редактировать, Сохранить, Удалить)
    const editButton = createActionButton('Редактировать', 'edit-btn');
    const saveButton = createActionButton('Сохранить', 'save-btn', true);  // Кнопка "Сохранить" по умолчанию скрыта
    const deleteButton = createActionButton('Удалить', 'delete-btn');

    actionCell.appendChild(editButton);
    actionCell.appendChild(saveButton);
    actionCell.appendChild(deleteButton);

    // Функция включения режима редактирования
    editButton.addEventListener('click', () => {
        nameCell.innerHTML = `<input type="text" value="${user.name}" />`;
        emailCell.innerHTML = `<input type="text" value="${user.email}" />`;
        editButton.style.display = 'none';  // Скрыть кнопку редактирования
        saveButton.style.display = 'inline';  // Показать кнопку сохранения
    });

    // Функция сохранения изменений
    saveButton.addEventListener('click', () => {
        const updatedName = nameCell.querySelector('input').value;
        const updatedEmail = emailCell.querySelector('input').value;

        fetch(`http://localhost:3000/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: updatedName, email: updatedEmail })
        })
        .then(response => response.json())
        .then(updatedUser => {
            nameCell.textContent = updatedUser.name;
            emailCell.textContent = updatedUser.email;
            editButton.style.display = 'inline';  // Показать кнопку редактирования
            saveButton.style.display = 'none';  // Скрыть кнопку сохранения
        })
        .catch(error => {
            console.error('Ошибка при обновлении данных:', error);
            showError('Не удалось обновить данные пользователя. Попробуйте снова.');
        });
    });

    // Функция для удаления пользователя
    deleteButton.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите удалить пользователя?')) {
            fetch(`http://localhost:3000/users/${user.id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при удалении пользователя');
                usersTable.deleteRow(row.rowIndex);
                alert('Пользователь удален');
            })
            .catch(error => {
                console.error('Ошибка при удалении пользователя:', error);
                showError('Не удалось удалить пользователя. Попробуйте снова.');
            });
        }
    });
}

// Функция для создания кнопки действия
function createActionButton(text, className, hidden = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.style.display = hidden ? 'none' : 'inline';  // Установить видимость кнопки
    return button;
}

// Функция для добавления пользователя через POST
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Останавливаем стандартное поведение формы

    const formData = new FormData(this);  // Создаем объект FormData

    fetch('http://localhost:3000/users', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(newUser => {
        const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
        addUserToTable(newUser, usersTable);
        this.reset(); // Сбрасываем форму после успешной отправки
    })
    .catch(error => {
        console.error('Ошибка при отправке данных:', error);
    });
});

// Загружаем пользователей при загрузке страницы
window.onload = loadUsers;

function showError(message) {
    const responseElement = document.getElementById('response');
    responseElement.textContent = message;
}
