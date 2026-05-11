const users = [
  {
    id: 1,
    name: 'João Silva',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
  },
  {
    id: 3,
    name: 'Carlos Henrique',
  },
  {
    id: 4,
    name: 'Ana Paula',
  },
  {
    id: 5,
    name: 'Fernanda Costa',
  },
  {
    id: 6,
    name: 'Pedro Santos',
  },
]
  
const selectedUsers = []
  
const authorsInput = document.getElementById('authors-input')
const dropdown = document.getElementById('authors-dropdown')
const selectedContainer = document.getElementById('selected-authors')
  
function renderDropdown(search = '') {
  dropdown.innerHTML = ''
    
  const filteredUsers = users.filter(user => {
    const alreadySelected = selectedUsers.some(
      selected => selected.id === user.id,
    )
      
    return (
      !alreadySelected
        && user.name.toLowerCase().includes(search.toLowerCase())
    )
  })
    
  if(!filteredUsers.length) {
    dropdown.style.display = 'none'
    return
  }
    
  dropdown.style.display = 'block'
    
  filteredUsers.forEach(user => {
    const item = document.createElement('div')
      
    item.className = 'authors-dropdown-item'
    item.textContent = user.name
      
    item.addEventListener('click', () => {
      selectedUsers.push(user)
        
      renderSelectedUsers()
        
      authorsInput.value = ''
      dropdown.style.display = 'none'
    })
      
    dropdown.appendChild(item)
  })
}
  
function renderSelectedUsers() {
  selectedContainer.innerHTML = ''
    
  selectedUsers.forEach(user => {
    const tag = document.createElement('div')
      
    tag.className = 'author-tag'
      
    tag.innerHTML = `
        <span>${user.name}</span>
      
        <button type="button" data-id="${user.id}">
          ×
        </button>
      `
      
    const removeButton = tag.querySelector('button')
      
    removeButton.addEventListener('click', () => {
      const index = selectedUsers.findIndex(
        selected => selected.id === user.id,
      )
        
      if(index >= 0) {
        selectedUsers.splice(index, 1)
      }
        
      renderSelectedUsers()
    })
      
    selectedContainer.appendChild(tag)
  })
}
  
authorsInput.addEventListener('input', () => {
  renderDropdown(authorsInput.value)
})
  
authorsInput.addEventListener('focus', () => {
  renderDropdown(authorsInput.value)
})
  
document.addEventListener('click', (event) => {
  if(!event.target.closest('.authors-box')) {
    dropdown.style.display = 'none'
  }
})