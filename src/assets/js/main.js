(function () {
  const result = document.querySelector('#result')

  function initEvent() {
    document.querySelector('#search').addEventListener('submit', function (e) {
      e.preventDefault()
      if (e.target[0].value) {
        result.innerHTML = ''
        changeTextButton(e.target[1], 'SEARCHING...')
        search(e.target)
      }
    }, false)
  }

  function changeTextButton(button, text) {
    button.textContent = text
  }

  function search(form) {
    const formData = new FormData(form)


    // WITH BACK-END:

    // fetch(`http://localhost:3000/foods/${formData.get('name')}`)
    //   .then(resp => resp.json())
    //   .then(resp => {
    //     if (!resp.error) {
    //       resp.forEach(hint => {
    //         insertCard(hint.food)
    //       })
    //     }
    //     else {
    //       changeInput(form[0], 'placeholder', 'We didn\'t found any food.')
    //       resetInput(form[0])
    //     }
    //     changeTextButton(form[1], 'SEARCH')
    //     changeInput(form[0], 'value', '')
    //   }).catch(() => {
    //     changeTextButton(form[1], 'SEARCH')
    //     changeInput(form[0], 'placeholder', 'An error has occurred. Try again later.')
    //     resetInput(form[0])
    //   })


    // WITHOUT BACK-END (TO DEPLOY IN SURGE.SH):

    fetch(`https://api.edamam.com/api/food-database/parser?app_id=ca747d07&app_key=722fabaee32b8118f7b1cb2e32b137cf&ingr=${formData.get('name')}`)
      .then(resp => resp.json())
      .then(resp => {
        if (resp.hints.length) {
          resp.hints.forEach(hint => {
            insertCard(hint.food)
          })
        }
        else {
          changeInput(form[0], 'placeholder', 'We didn\'t found any food.')
          resetInput(form[0])
        }
        changeTextButton(form[1], 'SEARCH')
        changeInput(form[0], 'value', '')
      }).catch(() => {
        changeTextButton(form[1], 'SEARCH')
        changeInput(form[0], 'placeholder', 'An error has occurred. Try again later.')
        resetInput(form[0])
      })
  }

  function resetInput(input) {
    setTimeout(() => {
      changeInput(input, 'placeholder', 'Type a food or a meal...')
    }, 3000)
  }

  function changeInput(input, prop, value) {
    input[prop] = value
  }

  function insertCard(food) {
    result.insertAdjacentHTML('beforeend', buildCard(food))
  }

  function buildCard(data) {
    const energy = data.nutrients.ENERC_KCAL ? `<li><b>Energy: </b><span>${data.nutrients.ENERC_KCAL.toFixed(1)}kcal</span></li>` : ''
    const carbs = data.nutrients.CHOCDF ? `<li><b>Carbs: </b><span>${data.nutrients.CHOCDF.toFixed(1)}g</span></li>` : ''
    const protein = data.nutrients.PROCNT ? `<li><b>Protein: </b><span>${data.nutrients.PROCNT.toFixed(1)}g</span></li>` : ''
    const fat = data.nutrients.FAT ? `<li><b>Fat: </b><span>${data.nutrients.FAT.toFixed(1)}g</span></li>` : ''

    const html = `
    <div class="card">
      <div class="card-header">
        <h3>${data.label}</h3>
        <h4>${data.category}</h4>
      </div>
      <div class="card-body">
        <ul>
          ${energy}
          ${carbs}
          ${protein}
          ${fat}
        </ul>
      </div>
      <div class="card-footer">
        <p><b>Brand: </b><span>${data.brand || 'None :('}</span></p>
      </div>
    </div>
    `

    return html
  }

  initEvent()
})()
