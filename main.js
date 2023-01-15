
// console.log(document.URL)
// checks current document page and if home page gets a cocktail else does not run fetch
if ( document.URL.includes("index.html")){
    init()
}

// ******************************************************INIT*******************************************************************8
function init() {

    removeCocktails()
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.error(error))
}

// ******************************************************REMOVE DRINKS*******************************************************************8
//remove existing cocktails
function removeCocktails() {
    let cocktails = document.getElementsByClassName('gridCocktails')
    // console.log(cocktails)
    if (cocktails.length !== 0) {
        // console.log(cocktails.item(0))
        for (let i = 0; i < cocktails.length;) {
            // console.log(cocktails.length)
            cocktails.item(0).remove()
        }

    }
}

// ******************************************************HANDLE DATA*******************************************************************
function handleData(data) {

    //if data has no null values, create divs on page, else repopulate homepage
    if ( !checkNUll(data)){
        //for every element get the key:value pairs and only return pairs with no null values
        data.drinks.forEach(element => {
            // console.log( Object.values(element).filter(value => value !=null))
            let entries = Object.entries(element)
            let nonNUll = entries.filter(item => item[1] != null)
            makeDivs(nonNUll)
        });
    } else{
        alert('no results found')
        init()
    }
}

// used when fetch request only returns a cocktail name and an image, then it makes another fetch request to get full details
function handleSmallData(data){

// goes through data and fetches full data for every cocktail
data.drinks.forEach(drink =>{
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink.strDrink}`)
    .then(response => response.json())
    .then(data => handleData(data))
    .catch(error => console.error(error))
    // console.log(drink.strDrink)
})
}

// ******************************************************MAKE COCKTAIL DIVS*******************************************************************8

function makeDivs(drink) {
    let listItems = []
    let container = document.getElementById('grid')
    let div = document.createElement('div')
    div.className = "gridCocktails"

    // let listItem = document.createElement('li')
    let list = document.createElement('ul')

    drink.forEach(property => {
        let h = document.createElement('h2')
        let img = document.createElement('img')
        list.className = "list"

        if (property[0] == "strDrink") {
            h.className = "header"
            h.innerHTML = property[1]
            name.innerHTML = property[1]
            div.appendChild(h)
        }
        if (property[0] == "strDrinkThumb") {
            img.className = "image"
            img.setAttribute("src", `${property[1]}`)
            div.appendChild(img)
        } else {
            //checks for categories to ignore
            if (property[0] !== "strInstructionsDE" && property[0] !== "strInstructionsIE" && property[0] != "strInstructionsIT" && property[0] != "idDrink" && property[0] != "strDrink"
                && property[0] != "strImageSource" && property[0] != "strImageAttribution" && property[0] != "strCreativeCommonsConfirmed" && property[0] != "dateModified" && property[0] != "strVideo"
                && property[0] != "InstructionsES") {
                listItems.push(`${property[0].replace("str", "")} :<br>  ${property[1]}`)
            }
        }
    })
    // joins array items into list elements
    var htmlList = listItems.map(item => {
        //returns items after splitting into seperate lists in order to use multiple colours
        return '<li class="listItems1">' + item.split("<br>")[0] + '</li> <li class="listItems2">' + item.split("<br>")[1] + '</li>'
    }).join('')

    list.innerHTML = htmlList

        div.appendChild(list)
        container.appendChild(div)

}

// ******************************************************FETCH DATA*******************************************************************8
//fetches data from an api and sends to a function when all data is fetched
function getCocktails(cocktail) {

removeCocktails()
let search = searchType()
cocktail = document.getElementById('cocktail').value

if ( cocktail === ""){
    alert("please enter a valid search value")
    init() 
}

// if a search value provided, use corresponsing api call to get desired data
if (cocktail != ""){
    if (search === 'name') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.error(error))
    }
    if (search === 'ingredient') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${cocktail}`)
        .then(response => response.json())
        .then(data =>handleSmallData(data))
        .catch(error => console.error(error))
    }
    if (search === 'category') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${cocktail}`)
        .then(response => response.json())
        .then(data => handleSmallData(data))
        .catch(error => console.error(error))
    }
    if (search === 'glass') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${cocktail}`)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.error(error))
    }
    if (search === 'alcoholic') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic`)
        .then(response => response.json())
        .then(data => handleSmallData(data))
        .catch(error => console.error(error))
    }
    if (search === 'non-alcoholic') {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`)
        .then(response => response.json())
        .then(data => handleSmallData(data))
        .catch(error => console.error(error))
    }   
        document.getElementById('cocktail').value = ""

}
}

// ******************************************************GET SEARCH TYPE*******************************************************************8
function searchType() {
    let search = document.getElementById("select")
    return search.value
}

// ******************************************************SCROLL BLUR*******************************************************************8
var timer
var elements = document.getElementById('gridContainer')

if (elements !== null){
// when the user scrolls it blurs the screen, on 100ms of scroll release it unblurs
    window.addEventListener("scroll", (e) => {
    clearTimeout(timer)

    // console.log(elements.children['grid'].children)
    for (let i = 0; i < elements.children['grid'].children.length; i++) {
        elements.children['grid'].children[i].children[2].style.filter = 'blur(3px)'
    }

    timer = setTimeout(function () {
        for (let i = 0; i < elements.children['grid'].children.length; i++) {
            elements.children['grid'].children[i].children[2].style.filter = 'blur(0px)'
        }
        // elements.style.filter = 'blur(0px)'
    }, 100)

    })
}


//  checks obj values and returns true if a null is found
function checkNUll(obj){
return Object.values(obj).includes(null)
}







